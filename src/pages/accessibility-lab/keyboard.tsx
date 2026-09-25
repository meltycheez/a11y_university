import { useRef, useState } from "react";
import { Dropdown } from "~/components/widgets";
import { Tabs } from "~/components/Tabs";
import { Modal } from "~/components/Modal";
import { useScenario } from "~/a11y/useScenario";
import { Specimen } from "./_Specimen";

export { inventoryMeta as meta } from "~/routes/meta";

function DropdownSpecimen() {
  const [value, setValue] = useState("email");
  return (
    <Dropdown
      label="Preferred contact method"
      options={[{ value: "email", label: "Email" }, { value: "phone", label: "Phone" }, { value: "mail", label: "Mail" }]}
      value={value}
      onChange={setValue}
      scenario="dropdown-keyboard-lab"
      defect="mouse-only"
    />
  );
}

function HoverMenuSpecimen() {
  const id = "menu-keyboard-lab";
  const fixed = useScenario(id);
  const [open, setOpen] = useState(false);
  if (fixed) {
    return (
      <nav aria-label="Resources" data-a11y-scenario={id}>
        <button type="button" aria-expanded={open} aria-controls="lab-hover-menu-list" onClick={() => setOpen((o) => !o)}>
          Resources
        </button>
        <ul id="lab-hover-menu-list" hidden={!open}>
          <li><a href="#">Advising guide</a></li>
          <li><a href="#">Tutoring schedule</a></li>
        </ul>
      </nav>
    );
  }
  return (
    <nav aria-label="Resources" className="lab-hover-menu" data-a11y-scenario={id}>
      <span className="lab-hover-menu-trigger">Resources</span>
      <ul className="lab-hover-menu-list">
        <li><a href="#">Advising guide</a></li>
        <li><a href="#">Tutoring schedule</a></li>
      </ul>
    </nav>
  );
}

function TabsSpecimen() {
  return (
    <Tabs
      label="Sample tabs"
      scenario="tabs-keyboard-lab"
      defect="broken-keys"
      tabs={[{ label: "One", content: <p>One</p> }, { label: "Two", content: <p>Two</p> }, { label: "Three", content: <p>Three</p> }]}
    />
  );
}

function ModalSpecimen() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open dialog</button>
      <Modal open={open} title="Sample dialog" onClose={() => setOpen(false)} scenario="modal-keyboard-lab" defect="no-trap">
        <p>Dialog content.</p>
      </Modal>
    </>
  );
}

function DragDropSpecimen() {
  const id = "drag-drop-keyboard-lab";
  const fixed = useScenario(id);
  const [items, setItems] = useState(["First reading", "Second reading", "Third reading"]);
  const dragIndex = useRef<number | null>(null);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  return (
    <ul className="lab-drag-list" data-a11y-scenario={id}>
      {items.map((item, i) => (
        <li
          key={item}
          draggable
          onDragStart={() => { dragIndex.current = i; }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragIndex.current !== null) move(dragIndex.current, i);
            dragIndex.current = null;
          }}
        >
          <span>{item}</span>
          {fixed && (
            <span className="lab-drag-controls">
              <button type="button" disabled={i === 0} onClick={() => move(i, i - 1)}>Move up</button>
              <button type="button" disabled={i === items.length - 1} onClick={() => move(i, i + 1)}>Move down</button>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function CarouselSpecimen() {
  const id = "carousel-keyboard-lab";
  const fixed = useScenario(id);
  const slides = ["Slide one: Fall welcome week", "Slide two: Homecoming", "Slide three: Finals support"];
  const [active, setActive] = useState(0);
  const go = (delta: number) => setActive((a) => (a + delta + slides.length) % slides.length);
  return (
    <div className="lab-carousel" data-a11y-scenario={id}>
      {fixed
        ? <button type="button" onClick={() => go(-1)} aria-label="Previous slide">‹</button>
        : <div onClick={() => go(-1)}>‹</div>}
      <p>{slides[active]}</p>
      {fixed
        ? <button type="button" onClick={() => go(1)} aria-label="Next slide">›</button>
        : <div onClick={() => go(1)}>›</div>}
    </div>
  );
}

function PositiveTabIndexSpecimen() {
  const id = "positive-tabindex-keyboard-lab";
  const fixed = useScenario(id);
  return (
    <div className="lab-tabindex-row" data-a11y-scenario={id}>
      <div className="field"><label htmlFor="lab-ti-a">Field A</label><input id="lab-ti-a" type="text" /></div>
      <div className="field"><label htmlFor="lab-ti-b">Field B</label><input id="lab-ti-b" type="text" tabIndex={fixed ? undefined : 1} /></div>
      <div className="field"><label htmlFor="lab-ti-c">Field C</label><input id="lab-ti-c" type="text" /></div>
    </div>
  );
}

export default function KeyboardLab() {
  return (
    <>
      <h1>Keyboard Specimens</h1>
      <p>
        Each specimen below works with a mouse but not fully with a keyboard while its toggle is off. Tab through each one, then turn on
        Fix Manual Testing Issues to see the accessible version.
      </p>
      <Specimen id="dropdown-keyboard-lab"><DropdownSpecimen /></Specimen>
      <Specimen id="menu-keyboard-lab"><HoverMenuSpecimen /></Specimen>
      <Specimen id="tabs-keyboard-lab"><TabsSpecimen /></Specimen>
      <Specimen id="modal-keyboard-lab"><ModalSpecimen /></Specimen>
      <Specimen id="drag-drop-keyboard-lab"><DragDropSpecimen /></Specimen>
      <Specimen id="carousel-keyboard-lab"><CarouselSpecimen /></Specimen>
      <Specimen id="positive-tabindex-keyboard-lab"><PositiveTabIndexSpecimen /></Specimen>
    </>
  );
}
