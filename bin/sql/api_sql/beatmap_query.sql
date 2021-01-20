select
	id as 'BeatmapID', 
	set_id as 'BeatmapSetID', 
	version as 'DiffName', 
	mode as 'Mode', 
	mode_txt as 'Mode_Text', 
	FORMAT(bpm, 1) as 'BPM', 
	FORMAT(ar, 1) as 'AR',
    FORMAT(cs, 1) as 'CS',
	FORMAT(od, 1) as 'OD',
    FORMAT(hp, 1) as 'HP',
	max_combo as 'MaxCombo', 
	playcount as 'Playcount', 
	passcount as 'Passcount', 
	total_length as 'TotalLength', 
	hit_length as 'HitLength',
	FORMAT(difficulty_rating, 1) as 'DifficultyRating', 
	count_circles as 'CircleCount', 
	count_spinners as 'SpinnerCount', 
	count_sliders as 'SliderCount'
from
	BeatmapMirror.beatmaps
where set_id = {0};