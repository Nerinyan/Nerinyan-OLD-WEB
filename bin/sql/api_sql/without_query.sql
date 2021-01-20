SELECT 
    set_id AS 'SetID',
    set_ranked AS 'RankedStatus',
    set_submitted_date AS 'ApprovedDate',
    set_last_updated AS 'LastUpdate',
    artist AS 'Artist',
    title AS 'Title',
    creator AS 'Creator',
    creator_id AS 'CreatorID',
    favourite_count AS 'Favourites',
    tags AS 'Tags',
    has_video AS 'HasVideo',
    has_storyboard AS 'HasStoryboard',
    genre_id AS 'Genre',
    language_id AS 'Language'
FROM
    BeatmapMirror.beatmaps
WHERE
    ranked IN ({0}) AND mode = {1}
GROUP BY set_id
ORDER BY last_updated DESC
LIMIT {2} , {3};