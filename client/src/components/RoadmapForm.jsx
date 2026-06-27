import { useState } from "react";

function RoadmapForm({ onAddRoadmap }) {
  const [title, setTitle] = useState("");

  const [steps, setSteps] = useState([
    {
      title: "",
    },
  ]);

  const addStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        title: "",
      },
    ]);
  };

  const handleStepChange = (index, value) => {
    const updatedSteps = [...steps];

    updatedSteps[index].title = value;
    setSteps(updatedSteps);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onAddRoadmap({
      title,
      steps,
    });

    setTitle("");
    setSteps([
      {
        title: "",
      },
    ]);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Roadmap Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {steps.map((step, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Step ${index + 1}`}
            value={step.title}
            onChange={(e) => handleStepChange(index, e.target.value)}
          />
        ))}

        <button type="button" onClick={addStep}>
          Add Step
        </button>

        <button>Create Roadmap</button>
      </form>
    </div>
  );
}

export default RoadmapForm;
