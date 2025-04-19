import { interval, switchMap, catchError, of } from "rxjs";
import { ajax } from "rxjs/ajax";

const messagesContainer = document.querySelector(".messages-container");

function render(data) {
  if (data.status === "nothing") return;

  const { messages } = data;

  messages.forEach((message) => {
    const { from, subject, received } = message;
    let resultMsg;
    if (subject.length > 15) {
      resultMsg = subject.substr(0, 15) + "...";
    } else {
      resultMsg = subject;
    }

    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };

    const date = new Date(received * 1000);

    const formattedDate = date.toLocaleDateString("ru-RU", options);

    messagesContainer.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="message">
        <div class="mail">${from}</div>
        <div class="message-text">${resultMsg}</div>
        <div class="time">${formattedDate}</div>
      </div>
      `,
    );
  });
}

const messageStream$ = interval(5000).pipe(
  switchMap(() =>
    ajax.getJSON("http://localhost:7070/messages/unread").pipe(
      catchError((err) => {
        if (err.status === 400) {
          return of(err.response);
        }
      }),
    ),
  ),
);

messageStream$.subscribe((msgs) => {
  render(msgs);
});
