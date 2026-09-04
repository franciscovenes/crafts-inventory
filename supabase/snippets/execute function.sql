select
  *
from
  search_items (
    '{
  "keywords": [],
  "hardFilters": [
    {
      "type": "masterData",
      "field": "model",
      "value": "Andean Forest"
    },
    {
      "type": "masterData",
      "field": "model",
      "value": "Ocean Whisper"
    }
  ]
}'::jsonb
  )