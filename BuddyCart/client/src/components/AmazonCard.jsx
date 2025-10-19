import React from "react";
import { Link } from "react-router-dom";
import "../styles/AmazonCard.css";

function pickBadgeByWeather(weather) {
  if (!weather || weather.temp == null) return null;
  const t = weather.feelsLike ?? weather.temp;
  if (t >= 20) return "Hot pick";
  if (t >= 15) return "Daily wear";
  return "Cold day pick";
}

function AmazonCard({
  item,
  title,
  imageSrc,
  imageAlt,
  actionText = "Add to cart",
  href,
  badge,
  eyebrow,
  clickable = false,
  onAction,
  weather,
  className=''
}) {
  const weatherBadge = pickBadgeByWeather(weather);
  const showBadge = badge ?? weatherBadge;

  const tTitle = title ?? item?.title ?? "";
  const tImage = imageSrc ?? item?.thumbnail ?? item?.image;
  const tAlt   = imageAlt ?? tTitle;
  const tHref  = href ?? (item ? `/items/${item.id}` : undefined);

  const eyebrowText =
    eyebrow ??
    (weather?.city
      ? `${weather.city} · ${weather.feelsLike ?? weather.temp}°C`
      : undefined);

  const media = (
    <div className="amazon-card-media">
      {showBadge && <span className="amazon-card-badge">{showBadge}</span>}
      {tImage ? (
        <img src={tImage} alt={tAlt} loading="lazy" />
      ) : (
        <div className="amazon-card-placeholder">No image</div>
      )}
    </div>
  );

  const body = (
    <div className="amazon-card-body">
      {eyebrowText && <p className="amazon-card-eyebrow">{eyebrowText}</p>}
      <h3 className="amazon-card-title">{tTitle}</h3>

   
      {!clickable && (
        <button onClick={onAction} className="amazon-card-button">
          {actionText}
        </button>
      )}
    </div>
  );

  const content = (
    <article className="amazon-card">
      {media}
      {body}
    </article>
  );

 
  return clickable && tHref ? (
    <article className={`amazon-card ${className}`}>
    <Link to={tHref} state={{ item }} className="amazon-card-link">
      {content}
    </Link>
    </article>
  ) : (
    content
  );
}

export default AmazonCard;
