const Response = ({
  linearRegressionContainer,
  table,
  containerTableHeadline,
  buttonMlr,
  numWeights,
  button1Hidden,
  button2Hidden,
  linearRegressionContainer2Hidden,
  linearRegressionContainer1Hidden,
  linearRegressionStatus1Hidden,
  linearRegressionStatus2Hidden,
  simpleLinearRegressionStatus
}) => {
  return (
    <section>
      <p className="section-head">Training Progress</p>
      <div className="with-cols">
        <div id="linear">
          <div className="chart" ref={linearRegressionContainer}></div>
          <div className="status" ref={simpleLinearRegressionStatus}></div>
          <div id="modelInspectionOutput">
            <p
              id="inspectionHeadline"
              ref={(el) => (containerTableHeadline.current = el)}
            ></p>
            <table style={{ marginBottom: "20px" }}>
              {table &&
                table
                  .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
                  .slice(0, numWeights)
                  .map((el) => {
                    return (
                      <tr key={el.value}>
                        <td>{el.description}</td>
                        <td
                          style={{
                            color: el.value > 0 ? "green" : "red",
                            paddingLeft: parseFloat(el.value) && "20px"
                          }}
                        >
                          {Math.abs(el.value.toFixed(2))}
                        </td>
                      </tr>
                    );
                  })}
            </table>
          </div>
        </div>
        <div id="oneHidden">
          <div class="chart" ref={linearRegressionContainer1Hidden}></div>
          <div class="status" ref={linearRegressionStatus1Hidden}></div>
        </div>
        <div id="twoHidden">
          <div class="chart" ref={linearRegressionContainer2Hidden}></div>
          <div class="status" ref={linearRegressionStatus2Hidden}></div>
        </div>
      </div>

      <div id="buttons" style={{ marginTop: "20px" }}>
        <div className="with-cols">
          <button ref={(el) => (buttonMlr.current = el)} id="simple-mlr">
            Train Linear Regressor
          </button>
          <button
            ref={(el) => (button1Hidden.current = el)}
            id="nn-mlr-1hidden"
          >
            Train Neural Network Regressor (1 hidden layer)
          </button>
          <button
            id="nn-mlr-2hidden"
            ref={(el) => (button2Hidden.current = el)}
          >
            Train Neural Network Regressor (2 hidden layers)
          </button>
        </div>
      </div>
    </section>
  );
};

export default Response;
