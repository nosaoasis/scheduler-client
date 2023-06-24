import React from "react";

import "components/Appointment/styles.scss";

import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";


import useVisualMode from "../../hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const SAVE = "SAVE";
const CREATE = "CREATE";
const CONFIRM = "CONFIRM";
const DELETE = "DELETE";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { id, time, interview, interviewers, bookInterview, cancelInterview } =
    props;

  const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVE);
    bookInterview(id, interview)
      .then(() => {
        transition(SHOW);
      })
      .catch(() => transition(ERROR_SAVE, true));
  };

  const confirmDelete = () => transition(CONFIRM);

  const handleDelete = (id) => {
    transition(DELETE, true);
    cancelInterview(id)
      .then(() => {
        transition(EMPTY);
      })
      .catch(() => transition(ERROR_DELETE, true));
  };

  const onEdit = () => transition(EDIT);

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={time} />
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && interview && (
          <Show
            student={interview.student}
            interviewer={interview.interviewer}
            onEdit={onEdit}
            onDelete={confirmDelete}
          />
        )}
        {mode === CREATE && (
          <Form interviewers={interviewers} onCancel={back} onSave={save} />
        )}
        {mode === SAVE && <Status message={"Saving"} />}
        {mode === DELETE && <Status message={"Deleting"} />}
        {mode === CONFIRM && (
          <Confirm
            message={"Are you sure you would like to delete?"}
            onCancel={back}
            onConfirm={() => handleDelete(id)}
          />
        )}
        {mode === EDIT && (
          <Form
            student={interview.student}
            interviewer={interview.interviewer.id}
            interviewers={interviewers}
            onCancel={back}
            onSave={save}
          />
        )}
        {mode === ERROR_SAVE && (
          <Error message="Could not save appointment" onClose={back} />
        )}
        {mode === ERROR_DELETE && (
          <Error message="Could not delete appointment" onClose={back} />
        )}
    </article>
  );
}
