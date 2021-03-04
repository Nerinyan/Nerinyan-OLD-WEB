SELECT  beatmapset_id                                     AS SetID 
       ,ranked                                            AS RankedStatus 
       ,DATE_FORMAT(ranked_date,'%Y-%m-%d UTC %H:%i:%s')  AS ApprovedDate 
       ,DATE_FORMAT(last_updated,'%Y-%m-%d UTC %H:%i:%s') AS LastUpdate 
       ,Artist                                            AS Artist 
       ,title                                             AS Title 
       ,creator                                           AS Creator 
       ,bms.creator_id                                    AS CreatorID 
       ,play_count                                        AS Playcounts 
       ,favourite_count                                   AS Favourites 
       ,FORMAT(bpm,0)                                     AS BPM 
       ,bms.has_video                                     AS hasVideo 
       ,genre_id                                          AS Genre 
       ,language_id                                       AS Language 
       ,tags                                              AS Tags 
       ,bms.beatmaps_count                                AS BeatmapCount
FROM BeatmapMirror.`sets`
JOIN 
(
	SELECT  set_id 
	       ,has_video 
	       ,creator_id
              ,beatmaps_count
	FROM BeatmapMirror.beatmaps
	WHERE {0} 
	GROUP BY  set_id {1} 
) AS bms
ON bms.set_id = beatmapset_id {2};