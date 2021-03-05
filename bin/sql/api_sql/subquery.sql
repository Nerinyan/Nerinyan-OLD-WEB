SELECT  id                                                AS BeatmapID 
       ,set_id                                            AS BeatmapsetID 
       ,version                                           AS DiffName 
       ,mode                                              AS Mode 
       ,FORMAT(bpm,0)                                     AS BPM 
       ,FORMAT(ar,0)                                      AS AR 
       ,FORMAT(od,0)                                      AS OD 
       ,FORMAT(cs,0)                                      AS CS 
       ,FORMAT(hp,0)                                      AS HP 
       ,total_length                                      AS TotalLength 
       ,hit_length                                        AS HitLength 
       ,playcount                                         AS Playcount 
       ,passcount                                         AS Passcount 
       ,max_combo                                         AS MaxCombo 
       ,CONVERT(difficulty_rating,Float)                       AS DifficultyRating 
       ,count_circles                                     AS CircleCount 
       ,count_sliders                                     AS SliderCount 
       ,count_spinners                                    AS SpinnerCount 
       ,has_storyboard                                    AS HasStoryBoard 
       ,DATE_FORMAT(last_updated,'%Y-%m-%d UTC %H:%i:%s') AS LastUpdate
FROM BeatmapMirror.beatmaps
WHERE set_id = {} order by mode, difficulty_rating asc;  