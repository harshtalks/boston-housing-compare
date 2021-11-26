import Title from "./Title";
import Status from "./Status";
import Response from "./Response";
import { useState, useEffect, useRef } from "react";

//modules
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

//importing functions from js

import * as Normalization from "../js/normalization";
import { BostonHousingDataset, featureDescriptions } from "../js/data";

const NUM_EPOCHS = 200;
const BATCH_SIZE = 40;
const LEARNING_RATE = 0.01;
const TOTAL_WEIGHTS_TO_SHOW = 5;

const Container = () => {
  const [updateStatus, setUpdateStatus] = useState("Loading Data...");
  const [baselineStatus, setBaselineStatus] = useState(
    "Baseline Not Computed..."
  );
  const [table, setTable] = useState([]);
  //model doms
  let linearRegressionContainer = useRef(null);
  let linearRegressionContainer1Hidden = useRef(null);
  let linearRegressionContainer2Hidden = useRef(null);
  //model status doms
  let simpleLinearRegressionStatus = useRef(null);
  let linearRegressionStatus1Hidden = useRef(null);
  let linearRegressionStatus2Hidden = useRef(null);
  let containerTableHeadline = useRef(null);
  let buttonMlr = useRef(null);
  let button1Hidden = useRef(null);
  let button2Hidden = useRef(null);

  const bostonData = new BostonHousingDataset();
  const tensor = {};

  useEffect(() => {
    functionLoad();
  }, []);

  //function to pass into useEffect for immediate invoke after load
  const functionLoad = async () => {
    await bostonData.loadData();
    arrayToTensor();
    setUpdateStatus(
      "Data is now available as tensors.\nClick a train button to begin."
    );
    const message = computeBaseline();
    setBaselineStatus(message);
    await setup();
  };

  //linear RegressionModel
  const linearRegressionModel = () => {
    const model = tf.sequential();

    model.add(
      tf.layers.dense({
        inputShape: [bostonData.numFeatures],
        units: 1
      })
    );

    model.summary();

    return model;
  };

  //multilevel perceptron with 1 hidden level here

  const multiLayerPerceptronRegressionModelHidden1 = () => {
    const model = tf.sequential();

    model.add(
      tf.layers.dense({
        inputShape: [bostonData.numFeatures],
        units: 50,
        activation: "sigmoid",
        kernelInitializer: "leCunNormal"
      })
    );
    model.add(
      tf.layers.dense({
        units: 1
      })
    );

    model.summary();

    return model;
  };

  //tripleLayer perceptron regression model

  const multiLayerPerceptronRegressionModelHidden2 = () => {
    const model = tf.sequential();

    model.add(
      tf.layers.dense({
        inputShape: [bostonData.numFeatures],
        units: 50,
        activation: "sigmoid",
        kernelInitializer: "leCunNormal"
      })
    );

    model.add(
      tf.layers.dense({
        units: 50,
        activation: "sigmoid",
        kernelInitializer: "leCunNormal"
      })
    );

    model.add(
      tf.layers.dense({
        units: 1
      })
    );

    model.summary();

    return model;
  };

  //model fitting function
  const run = async (model, modelName, modelStatus, weightIllustration) => {
    model.compile({
      optimizer: tf.train.sgd(LEARNING_RATE),
      loss: "meanSquaredError"
    });

    let trainLogs = [];

    setUpdateStatus("Starting Training Process");
    //fitting train data
    await model.fit(tensor.trainFeatures, tensor.trainTargets, {
      batchsize: BATCH_SIZE,
      epochs: NUM_EPOCHS,
      validationSplit: 0.2,
      callbacks: {
        //callbacks
        onEpochEnd: async (epoch, logs) => {
          modelStatus.current.innerText = `Epoch ${
            epoch + 1
          } of ${NUM_EPOCHS} has completed.`;
          trainLogs.push(logs);
          tfvis.show.history(modelName, trainLogs, ["loss", "val_loss"]);

          if (weightIllustration) {
            model.layers[0]
              .getWeights()[0]
              .data()
              .then((kernelAsArr) => {
                const weightlist = describeKernelElements(kernelAsArr);
                setTable(weightlist);
                containerTableHeadline.current.innerText = `Top ${TOTAL_WEIGHTS_TO_SHOW} weights by magnitude`;
              });
          }
        }
      }
    });

    setUpdateStatus("Running Model on Test Data...");

    const results = model.evaluate(tensor.testFeatures, tensor.testTargets, {
      batchSize: BATCH_SIZE
    });

    const testLoss = results.dataSync()[0];
    const trainLoss = trainLogs[trainLogs.length - 1].loss;
    const valLoss = trainLogs[trainLogs.length - 1].val_loss;
    const message =
      `Final train-set loss: ${trainLoss.toFixed(4)}\n` +
      `Final validation-set loss: ${valLoss.toFixed(4)}\n` +
      `Test-set loss: ${testLoss.toFixed(4)}`;

    modelStatus.current.innerText = message;
  };

  //tensorCreation
  const arrayToTensor = () => {
    tensor.rawTrainFeatures = tf.tensor2d(bostonData.trainFeatures);
    tensor.trainTargets = tf.tensor2d(bostonData.trainTarget);
    tensor.rawTestFeatures = tf.tensor2d(bostonData.testFeatures);
    tensor.testTargets = tf.tensor2d(bostonData.testTarget);

    const { mean, std } = Normalization.determineMeanAndSTD(
      tensor.rawTrainFeatures
    );

    tensor.trainFeatures = Normalization.normalizedData(
      tensor.rawTrainFeatures,
      mean,
      std
    );

    tensor.testFeatures = Normalization.normalizedData(
      tensor.rawTestFeatures,
      mean,
      std
    );
  };

  //setup function to run when button is clicked
  const setup = async () => {
    buttonMlr.current.addEventListener("click", async () => {
      const model = linearRegressionModel();
      await run(
        model,
        linearRegressionContainer.current,
        simpleLinearRegressionStatus,
        true
      );
    });

    button1Hidden.current.addEventListener("click", async () => {
      const model = multiLayerPerceptronRegressionModelHidden1();
      await run(
        model,
        linearRegressionContainer1Hidden.current,
        linearRegressionStatus1Hidden,
        false
      );
    });

    button2Hidden.current.addEventListener("click", async () => {
      const model = multiLayerPerceptronRegressionModelHidden2();
      await run(
        model,
        linearRegressionContainer2Hidden.current,
        linearRegressionStatus2Hidden,
        false
      );
    });
  };

  const computeBaseline = () => {
    const avgValue = tensor.trainTargets.mean();

    const baselineError = tensor.testTargets.sub(avgValue).square().mean();
    return `Computed BaseLine Error is ${baselineError
      .dataSync()[0]
      .toFixed(2)}`;
  };

  //returning components

  //describing kernal Elements:

  const describeKernelElements = (kernel) => {
    tf.util.assert(
      kernel.length == 12,
      `kernel must be a array of length 12, got ${kernel.length}`
    );

    const outList = [];
    for (let idx = 0; idx < kernel.length; idx++) {
      outList.push({
        description: featureDescriptions[idx],
        value: kernel[idx]
      });
    }
    return outList;
  };

  return (
    <div className="tfjs-example-container centered-container">
      <Title />
      <Status updateStatus={updateStatus} baselineStatus={baselineStatus} />
      <Response
        linearRegressionContainer={linearRegressionContainer}
        containerTableHeadline={containerTableHeadline}
        table={table}
        buttonMlr={buttonMlr}
        numWeights={TOTAL_WEIGHTS_TO_SHOW}
        button1Hidden={button1Hidden}
        button2Hidden={button2Hidden}
        linearRegressionContainer1Hidden={linearRegressionContainer1Hidden}
        linearRegressionContainer2Hidden={linearRegressionContainer2Hidden}
        simpleLinearRegressionStatus={simpleLinearRegressionStatus}
        linearRegressionStatus1Hidden={linearRegressionStatus1Hidden}
        linearRegressionStatus2Hidden={linearRegressionStatus2Hidden}
      />
    </div>
  );
};

export default Container;
