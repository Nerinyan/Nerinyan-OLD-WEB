SELECT
	id, ranked_status, UNIX_TIMESTAMP(approved_date) as approved_date, UNIX_TIMESTAMP(last_update) as last_update, UNIX_TIMESTAMP(last_checked) as last_checked, artist, title, creator, favourites, FLOOR(bpm) as bpm, playcount, mode
FROM
	(select * from cheesegull.sets WHERE ranked_status = {2} LIMIT {0}) as base
left join
	(select bpm, parent_set_id, playcount, mode from cheesegull.beatmaps where mode = {1} group by parent_set_id) as cheese on base.id = cheese.parent_set_id
order by playcount desc
;