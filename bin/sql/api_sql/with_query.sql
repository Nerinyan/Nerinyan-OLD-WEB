SELECT  main.set_id                                                AS SetID 
       ,main.set_ranked                                            AS RankedStatus 
       ,DATE_FORMAT(main.set_ranked_date,'%Y-%m-%d UTC %H:%i:%s')  AS ApprovedDate 
       ,DATE_FORMAT(main.set_last_updated,'%Y-%m-%d UTC %H:%i:%s') AS LastUpdate 
       ,main.Artist                                                AS Artist 
       ,main.title                                                 AS Title 
       ,main.creator                                               AS Creator 
       ,main.creator_id                                            AS CreatorID 
       ,main.set_playcount                                         AS Playcounts 
       ,main.favourite_count                                       AS Favourites 
       ,FORMAT(main.set_bpm,0)                                     AS BPM 
       ,main.has_video                                             AS hasVideo 
       ,main.genre_id                                              AS Genre 
       ,main.language_id                                           AS Language 
       ,main.tags                                                  AS Tags 
       ,main.beatmaps_count                                        AS BeatmapCount
FROM BeatmapMirror.beatmaps main
JOIN 
(
	SELECT  *
	FROM BeatmapMirror.sets
	WHERE concat_ws(' ', beatmapset_id, artist, title, creator) like '%{0}%'
	ORDER BY last_updated desc  
) AS sets
ON sets.beatmapset_id = main.set_id
WHERE {1} 
GROUP BY  set_id {2};