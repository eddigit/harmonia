from flask import Blueprint, request, jsonify, send_file
from werkzeug.utils import secure_filename
import os
import json
from app.audio_processor import AudioProcessor
import logging

audio_bp = Blueprint('audio', __name__)
logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {'mp3', 'wav', 'flac', 'aac', 'm4a'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@audio_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'Harmonia Audio API'})

@audio_bp.route('/upload', methods=['POST'])
def upload_audio():
    """Handle audio file upload"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        file = request.files['audio']
        
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(request.current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        return jsonify({
            'success': True,
            'filename': filename,
            'filepath': filepath
        })
    
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@audio_bp.route('/analyze', methods=['POST'])
def analyze_audio():
    """Analyze audio file to detect BPM and key"""
    try:
        data = request.get_json()
        filepath = data.get('filepath')
        
        if not filepath or not os.path.exists(filepath):
            return jsonify({'error': 'File not found'}), 404
        
        processor = AudioProcessor(filepath)
        analysis = processor.analyze()
        
        return jsonify({
            'success': True,
            'bpm': analysis['bpm'],
            'duration': analysis['duration'],
            'sample_rate': analysis['sample_rate']
        })
    
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@audio_bp.route('/process', methods=['POST'])
def process_audio():
    """Process audio with specified transformations"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        file = request.files['audio']
        settings_json = request.form.get('settings', '{}')
        settings = json.loads(settings_json)
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        input_path = os.path.join(request.current_app.config['UPLOAD_FOLDER'], filename)
        file.save(input_path)
        
        # Process audio
        processor = AudioProcessor(input_path)
        
        # Apply transformations
        output_format = settings.get('exportFormat', 'mp3')
        output_filename = f"{os.path.splitext(filename)[0]}_harmonia_{settings.get('targetFrequency', 432)}Hz.{output_format}"
        output_path = os.path.join(request.current_app.config['OUTPUT_FOLDER'], output_filename)
        
        processor.process(
            tuning=settings.get('tuning', 432),
            tempo_adjustment=settings.get('tempoAdjustment', 0),
            target_frequency=settings.get('targetFrequency', 528),
            binaural_enabled=settings.get('binauralBeatEnabled', False),
            binaural_type=settings.get('binauralBeatType', 'alpha'),
            binaural_volume=settings.get('binauralBeatVolume', 30),
            output_path=output_path,
            output_format=output_format
        )
        
        return jsonify({
            'success': True,
            'output_filename': output_filename,
            'message': 'Audio processed successfully'
        })
    
    except Exception as e:
        logger.error(f"Processing error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@audio_bp.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    """Download processed audio file"""
    try:
        filepath = os.path.join(request.current_app.config['OUTPUT_FOLDER'], secure_filename(filename))
        
        if not os.path.exists(filepath):
            return jsonify({'error': 'File not found'}), 404
        
        return send_file(
            filepath,
            as_attachment=True,
            download_name=filename
        )
    
    except Exception as e:
        logger.error(f"Download error: {str(e)}")
        return jsonify({'error': str(e)}), 500
