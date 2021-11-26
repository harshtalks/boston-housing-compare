const Status = ({ updateStatus, baselineStatus }) => {
  return (
    <section>
      <p className="section-head">Status</p>
      <p id="status">{updateStatus}</p>
      <p id="baselineStatus">{baselineStatus}</p>
    </section>
  );
};

export default Status;
