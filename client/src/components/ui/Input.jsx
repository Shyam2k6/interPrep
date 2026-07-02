import "./Input.css";

function Input({ type = "text", ...props }) {
  return <input type={type} className="input" {...props} />;
}

export default Input;
