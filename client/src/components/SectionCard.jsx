const SectionCard = ({ title, description, children, className = "" }) => {
  return (
    <section className={`section-card ${className}`.trim()}>
      {(title || description) && (
        <div className="section-heading">
          {title ? <h3>{title}</h3> : null}
          {description ? <p>{description}</p> : null}
        </div>
      )}

      {children}
    </section>
  );
};

export default SectionCard;
