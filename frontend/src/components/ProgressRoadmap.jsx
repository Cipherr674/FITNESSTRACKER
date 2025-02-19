import '../styles/progress-roadmap.css';

export const ProgressRoadmap = ({ milestones = [] }) => {
  if (!milestones || !Array.isArray(milestones)) {
    console.error('Invalid milestones prop:', milestones);
    return <div className="progress-roadmap error">Error loading milestones</div>;
  }

  return (
    <div className="progress-roadmap">
      <h3 className="roadmap-title">Progress Milestones</h3>
      <div className="milestones-container">
        {milestones.length === 0 ? (
          <p className="no-milestones">No milestones available yet</p>
        ) : (
          milestones.map((milestone) => (
            <div 
              key={milestone.title}
              className={`milestone-card ${milestone.achieved ? 'achieved' : 'pending'}`}
            >
              <div className="milestone-header">
                <div className="status-indicator">
                  {milestone.achieved ? (
                    <span className="achieved-icon">✓</span>
                  ) : (
                    <div className="progress-circle">
                      {Math.round(milestone.progress)}%
                    </div>
                  )}
                </div>
                <div className="milestone-info">
                  <h4 className="milestone-title">{milestone.title}</h4>
                  <p className="milestone-description">{milestone.description}</p>
                </div>
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar"
                  style={{ width: `${milestone.progress}%` }}
                >
                  <div className="progress-fill"></div>
                </div>
                <div className="progress-stats">
                  <span>{milestone.currentValue}</span>
                  <span>{milestone.threshold}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 