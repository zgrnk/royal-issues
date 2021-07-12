import React from 'react';

const defaultData = {
  id: "",
  repository: {
    name: "",
    html_url: "",
  },
  title: "",
  state: "",
  labels: [
    {
      name: "",
    }
  ],
  assignees: [
    {
      login: "",
      html_url: "",
    }
  ],
  user: {
    login: "",
    html_url: "",
  },
}

export default function Issue ({data = defaultData}) {
  const workers = data.assignees && data.assignees.length > 0 ? data.assignees : null;
  const labels = data.labels && data.assignees.length > 0 ? data.labels : null;

  return (
    <div className="m-12 flex flex-col bg-blue-300 rounded-lg overflow-hidden max-w-md w-1/2">
      <div className="py-4 px-4 text-center tx-xl font-black">
        {`Issue ${data.id}`}
      </div>
      <TextSection label="Repo" text={data.repository.name} link={data.repository.html_url}/>
      <TextSection label="Issue Title" text={data.title}/>
      <TextSection label="Status" text={data.state}/>
      {labels ? labels.map((lbl, i) =>
          <TextSection key={i} label="Label" text={lbl.name} />
        ) : null}
      <TextSection label="Assigned By" text={data.user.login} link={data.user.html_url}/>
      {workers ? workers.map((w, i) =>
          <TextSection key={i} label="Assigned To" text={w.login} link={w.html_url}/>
        ) : null}
      <div className="px-4 py-8 text-sm text-left text-blue-900 bg-indigo-50">{data.body}</div>
      <ViewMoreBtn url={data.html_url}/>
    </div>
  );

}

function TextSection ({label, text, link=null}) {
  return (
    <div className="flex flex-row w-full justify-between items-center border border-white bg-blue-100 w-full select-none">
      <div className="px-4 py-3 text-md text-left font-bold">{label}</div>
      { link ?
        <div
          onClick={() => window.open(link)}
          className="mx-2 my-2 px-4 py-1 text-md text-left bg-blue-200 shadow rounded-full cursor-pointer sm:hover:bg-blue-300">
            {text}
        </div>
        :
        <div className="px-4 py-3 text-md text-left ">{text}</div>
      }
    </div>
  );
}

function ViewMoreBtn ({url}) {
  return (
    <div className="py-4 px-4 bg-blue-100 w-full flex justify-center items-center">
      <button
        className="my-2 px-4 py-1 bg-indigo-200 border-b-4 border-indigo-800 rounded-full text-lg sm:hover:bg-indigo-300"
        onClick={() => window.open(url)}
      >
          View More Info
      </button>
    </div>
  );
}
