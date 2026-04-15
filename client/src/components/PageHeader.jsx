const PageHeader = ({ title, description, children }) => {
  return (
    <div className="page-header">
      <div>
        <p className="eyebrow">Workspace</p>
        <h2>{title}</h2>
        <p className="page-description">{description}</p>
      </div>

      {children ? <div className="page-actions">{children}</div> : null}
    </div>
  );
};

export default PageHeader;
