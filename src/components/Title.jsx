const Title = () => {
  return (
    <>
      <section className="title-area">
        <h1>Boston Housing Price Predictor</h1>
        <p>Boston Housing Price Model using Multiple Linear Regression</p>
      </section>
      <section>
        <p className="section-head">Description</p>
        <p>
          {"This Model shows you how to perform regression with more than one input feature using the " +
            " "}
          <a href="https://www.cs.toronto.edu/~delve/data/boston/bostonDetail.html">
            Boston Housing Data
          </a>
          which is a famous data derived from information collected by the U.S.
          Census Service concerning Housing in the area of Boston Massachusetts.
        </p>
        <p>
          It allows you visually examine the linear regression model for
          predicting the house prices. When training the linear model, it will
          also display the largest 5 weights (by absolute value) of the model
          and the feature associated with each of those weights. three models
          used here are:
          <ul>
            <li>
              Simple Linear Regression with 1 layer and linear activation
              parameter
            </li>
            <li>
              Multilayer Perceptron Regression 2 layers - 1 hidden with
              <span style={{ color: "red" }}> sigmoid</span> activation function
            </li>
            <li>
              Multilayer Perceptron Regression 3 layers - 2 hidden with
              <span style={{ color: "green" }}> sigmoid</span> activation
              function
            </li>
          </ul>
        </p>
      </section>
    </>
  );
};

export default Title;
