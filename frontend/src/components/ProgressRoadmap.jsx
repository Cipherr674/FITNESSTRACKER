const ProgressRoadmap = ({ milestones = [] }) => {
  return (
    <div className="progress-roadmap">
      <h3>Milestones</h3>
      {milestones?.length === 0 ? (
        <p className="no-milestones">No milestones achieved yet</p>
      ) : (
        milestones?.map((milestone, index) => (
          <div key={index} className="milestone-item">
            {/* ... existing code ... */}
          </div>
        ))
      )}
    </div>
  );
}; 