import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import NoteList from "./NoteList";
import { v4 as uuidv4 } from "uuid";
import { currentDate } from "./utils";

const localStorageKey = "lotion-v1";

function Layout({profile, logOut}) {
  const navigate = useNavigate();
  const mainContainerRef = useRef(null);
  const [collapse, setCollapse] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentNote, setCurrentNote] = useState(-1);
  const [user, setUser] = useState("fabiha.neera@gmail.com"); 
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const height = mainContainerRef.current.offsetHeight;
    mainContainerRef.current.style.maxHeight = `${height}px`;
    const existing = localStorage.getItem(localStorageKey);
    if (existing) {
      try {
        setNotes(JSON.parse(existing));
      } catch {
        setNotes([]);
      }
    }
  }, []);

  useEffect(() => {
    const asyncEffect = async () => {

      if (user) {
        const accessToken = localStorage.getItem("accessToken");
        const promise = await fetch(`https://soxozwhiqtg35fwrduxte7ak640xyocr.lambda-url.ca-central-1.on.aws?email=${user}&id=${accessToken}`)
        if (promise.status === 200) {
          const notes = await promise.json();
          setNotes(notes);
        }
      }
    };
    asyncEffect();
  }, [user]);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (currentNote < 0) {
      return;
    }
    if (!editMode) {
      navigate(`/notes/${currentNote + 1}`);
      return;
    }
    navigate(`/notes/${currentNote + 1}/edit`);
  }, [notes]);

  const saveNote = async(note, index) => {
    note.body = note.body.replaceAll("<p><br></p>", "");
    setNotes([
      ...notes.slice(0, index),
      { ...note },
      ...notes.slice(index + 1),
    ]);
    setCurrentNote(index);
    setEditMode(false);
    const newNote = { title: note.title, body: note.body, when:note.when, id: note.id };

    const res = await fetch("https://kie5fraiapdbbeialmzfiiqfve0mtusi.lambda-url.ca-central-1.on.aws",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...newNote, email: user }),
    });
    const jsonRes = await res.json();
    console.log(jsonRes);
    localStorage.setItem(localStorageKey, JSON.stringify(notes));

  };

  const deleteNote = async(index) => {
    setNotes([...notes.slice(0, index), ...notes.slice(index + 1)]);
    setCurrentNote(0);
    setEditMode(false);
  };

  const addNote = () => {
    setNotes([
      {
        id: uuidv4(),
        title: "Untitled",
        body: "",
        when: currentDate(),
      },
      ...notes,
    ]);
    setEditMode(true);
    setCurrentNote(0);
  };

  return (
    <div id="container">
      <header>
        <aside>
          <button id="menu-button" onClick={() => setCollapse(!collapse)}>
            &#9776;
          </button>
        </aside>
        <div id="app-header">
          <h1>
            <Link to="/notes">Lotion</Link>
          </h1>
          <h6 id="app-motto">Like Notion, but worse.</h6>
        </div>
        <div id="header-right">
        <h5>Hello, {profile.name}</h5>
          <button onClick={logOut}><h4>(Log Out)</h4></button>
        </div>
      </header>
      <div id="main-container" ref={mainContainerRef}>
        <aside id="sidebar" className={collapse ? "hidden" : null}>
          <header>
            <div id="notes-list-heading">
              <h2>Notes</h2>
              <button id="new-note-button" onClick={addNote}>
                +
              </button>
            </div>
          </header>
          <div id="notes-holder">
            <NoteList notes={notes} />
          </div>
        </aside>
        <div id="write-box">
          <Outlet context={[notes, saveNote, deleteNote]} />
        </div>
      </div>
    </div>
  );
}

export default Layout;
