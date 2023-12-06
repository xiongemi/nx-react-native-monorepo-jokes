import React, { useCallback } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';

export interface CarouselCardProps<ID_TYPE> {
  id: ID_TYPE;
  lines: string[];
  like: (entity: { id: ID_TYPE; lines: string[] }) => void;
  cancelLike: (id: ID_TYPE) => void;
  dislike: (entity: { id: ID_TYPE; lines: string[] }) => void;
  cancelDislike: (id: ID_TYPE) => void;
  isLiked?: boolean;
  isDisliked?: boolean;
}

export function CarouselCard<ID_TYPE>({
  id,
  lines,
  isLiked,
  isDisliked,
  like,
  cancelLike,
  dislike,
  cancelDislike,
}: CarouselCardProps<ID_TYPE>) {
  const likeButtonClicked = useCallback(() => {
    if (isLiked) {
      cancelLike(id);
    } else {
      like({ id, lines });
      if (isDisliked) {
        cancelDislike(id);
      }
    }
  }, [cancelLike, isLiked, id, lines, like, isDisliked, cancelDislike]);

  const dislikeButtonClicked = useCallback(() => {
    if (isDisliked) {
      cancelDislike(id);
    } else {
      dislike({ id, lines });
      if (isLiked) {
        cancelLike(id);
      }
    }
  }, [cancelLike, isLiked, id, lines, dislike, isDisliked, cancelDislike]);

  return (
    <Card sx={{ minWidth: 275 }} raised={true}>
      <CardContent>
        {lines?.map((line) => (
          <Typography variant="body1">{line}</Typography>
        ))}
      </CardContent>
      <CardActions>
        <IconButton aria-label="Like" size="large" onClick={likeButtonClicked}>
          {isLiked ? (
            <FavoriteIcon fontSize="inherit" />
          ) : (
            <FavoriteBorderIcon fontSize="inherit" />
          )}
        </IconButton>
        <IconButton
          aria-label="Dislike Thumb Down"
          size="large"
          onClick={dislikeButtonClicked}
        >
          {isDisliked ? (
            <ThumbDownIcon fontSize="inherit" />
          ) : (
            <ThumbDownOffAltIcon fontSize="inherit" />
          )}
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default CarouselCard;
