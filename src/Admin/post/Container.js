import IconButton from "../common/IconButton";
import Inserter from "./Inserter";
function Container({ children, handler, onMove }) {
  return (
    <section className="section-divider inserter-parent">
      <div className="flex center">
        <IconButton name="chevronCircledUp" onClick={() => onMove(-1)} />
      </div>
      {children}
      <Inserter handler={handler} />
      <div className="flex center m6">
        <IconButton name="chevronCircledDown" onClick={() => onMove(1)} />
      </div>
    </section>
  );
}
export default Container;
