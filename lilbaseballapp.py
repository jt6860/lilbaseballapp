from flask import Flask, jsonify, make_response, request
from flask_cors import CORS
from flask_caching import Cache
from pybaseball import batting_stats, pitching_stats, standings
import pandas as pd
import logging
import json

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})  # Use 'simple' for in-memory caching

CORS(app)
logging.basicConfig(filename='app.log', level=logging.INFO)

@app.route('/api/bat_stats/<int:season>')
@cache.cached(timeout=3600, key_prefix='bat_stats')
def get_bat_stats(season):
    try:
        imported_batstats = batting_stats(season, season)
   
        # Check if the DataFrame is empty
        if imported_batstats.empty:
            return jsonify({'error': f'No batting statistics found for season {season}'}), 404

        ingested_batstats = [
            {
                'name': player['Name'],
                'season': season,
                'Team': player['Team'],
                'WAR': player['WAR'],
                'OPS': player['OPS'],
                'OBP': player['OBP'],
                'SLG': player['SLG'],
                'AVG': player['AVG'],
                'PA': player['PA'],
                'H': player['H'],
                'HR': player['HR'],
                'RBI': player['RBI'],
                'SB': player['SB'],
            }
            for player in imported_batstats.to_dict('records')
        ]
        
        app.logger.info(f"Cache hit for batting stats: season={season}")                 
        response = jsonify(ingested_batstats)
        response.headers['ETag'] = generate_etag(ingested_batstats)  # Generate ETag

        return response

    except Exception as e:
        app.logger.error(f"Cache miss for batting stats: season={season}. Error: {e}")
        return jsonify({'error': f'Error processing batting data: {str(e)}'}), 500

@app.route('/api/pitch_stats/<int:season>')
@cache.cached(timeout=3600)
def get_pitch_stats(season):
    try:
        imported_pitchstats = pitching_stats(season, season)

        # Check if the DataFrame is empty
        if imported_pitchstats.empty:
            return jsonify({'error': f'No pitching statistics found for season {season}'}), 404

        ingested_pitchstats = [
            {
                'name': player['Name'],
                'season': season,
                'Team': player['Team'],
                'WAR': player['WAR'],
                'IP': player['IP'],
                'G': player['G'],
                'AIPpG': player['IP']/player['G'],
                'ERA': player['ERA'],
                'W': player['W'],
                'L': player['L'],
                'SV': player['SV'],
                'WHIP': player['WHIP'],
                'K_per_9': player['K/9'],
                'K_pct': player['K%'],
                'LOB_pct': player['LOB%'],                
                }
            for player in imported_pitchstats.to_dict('records')
            ]

        app.logger.info(f"Cache hit for pitching stats: season={season}")                         
        response = jsonify(ingested_pitchstats)
        response.headers['ETag'] = generate_etag(ingested_pitchstats)  # Generate ETag

        return response

    except Exception as e:
        app.logger.error(f"Cache miss for pitching stats: season={season}. Error: {e}")
        return jsonify({'error': f'Error processing pitching data: {str(e)}'}), 500

@app.route('/api/standings/<int:season>')
@cache.cached(timeout=3600)
def get_standings(season):
    try:
        # Get standings data
        standings_data = standings(season) 

        # Handle the case where standings(season) returns a list of DataFrames 
        if isinstance(standings_data, list): 
            # Concatenate all DataFrames into a single DataFrame
            standings_df = pd.concat(standings_data) 
        else:
            standings_df = pd.DataFrame(standings_data) 

        # Check if the DataFrame is empty
        if standings_df.empty:
            return jsonify({'error': f'No standings data found for season {season}'}), 404

        ingested_standings = [
            {
                'Team': team['Tm'],  # Use 'Tm' column if available
                'season': season,
                'W': team['W'],
                'L': team['L'],
                'Win_pct': int(team['W'])/(int(team['W']) + int(team['L']))
            }
            for team in standings_df.to_dict('records')
        ]

        app.logger.info(f"Cache hit for standings: season={season}")                         
        response = jsonify(ingested_standings)
        response.headers['ETag'] = generate_etag(ingested_standings)  # Generate ETag

        return response

    except Exception as e:
        app.logger.error(f"Cache miss for standings: season={season}. Error: {e}")
        return jsonify({'error': f'Error processing standings data: {str(e)}'}), 500

def generate_etag(data):
    """Generates an ETag from the provided data."""
    import hashlib
    data_json = json.dumps(data)
    return hashlib.md5(data_json.encode()).hexdigest()

if __name__ == '__main__':
    app.run(debug=True)