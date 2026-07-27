import "./TopBar.css";

type Props = {
  title: string;
  center?: React.ReactNode;
  actions?: React.ReactNode;
};

export default function TopBar({
  title,
  center,
  actions,
}: Props) {

  return (
    <div className="search-panel">
      <div className="panel-header">
        <h2>{title}</h2>
        {actions && (
          <div className="panel-actions">
            {actions}
          </div>
        )}
      </div>

      {center && (
        <div className="top-bar">
          {center}
        </div>
      )}
    </div>
  );
}