const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h3> 잠시만 기다려주세요. </h3>
      <img src="/images/loading.gif" alt="loading" width="10%" />
    </div>
  );
};

export default Loading;
