"use client";
import Image from "next/image";
import styles from "../page.module.css";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PaperClipIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useCallback, useEffect } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TestcardItem from "../components/TestcardItem";
import { Container } from "postcss";
import TableComponent from "../components/TableComponent";
import Link from "next/link";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { useRouter } from "next/navigation";

const skills_soft = [
  {
    id: 1,
    name: "Comunicación estratégica",
  },

  {
    id: 2,
    name: "Pensamiento sistémico",
  },

  {
    id: 3,
    name: "Creatividad",
  },
];

const skills_hard = [
  {
    id: 1,
    name: "Python",
  },

  {
    id: 2,
    name: "Typescript",
  },

  {
    id: 3,
    name: "Cálculo multivariable",
  },
];

const dificultad = [
  {
    id: 1,
    name: "Alta",
  },

  {
    id: 2,
    name: "Media",
  },

  {
    id: 3,
    name: "Baja",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Project_create() {
  let project_data = { soft_skills: [], hard_skills: [], roles: [] };
  if (typeof window !== "undefined") {
    // Perform localStorage action
    project_data = JSON.parse(localStorage.getItem("project_selected"));
  }

  const router = useRouter();

  const [selectedCandidate, setSelectedCandidate] = useState({
    users: [],
  });
  const [assignedCandidate, setAssignedCandidate] = useState({
    users: [],
  });
  const [tests, setTests] = useState([])

  async function obtainSelectedCandidates() {
    const response = await fetch(
      `https://fli2mqd2g8.execute-api.us-east-1.amazonaws.com/dev/projects/${project_data.id}/selectedcandidates`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (data.message) {
      return;
    }

    await setSelectedCandidate(data);
  }

  async function obtainAssignedCandidates() {
    const response = await fetch(
      `https://fli2mqd2g8.execute-api.us-east-1.amazonaws.com/dev/projects/${project_data.id}/assignedcandidates`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (data.message) {
      return;
    }

    await setAssignedCandidate(data);
  }

  const getTests = async () => {
    const request = await fetch(`https://fli2mqd2g8.execute-api.us-east-1.amazonaws.com/dev/tests/projects/${project_data.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

    const response = await request.json()

    const testsFiltered = response.filter((test) => test.type === "technical")
    await setTests(testsFiltered)
  }

  const handleAssignCandidate = async (candidate_id) => {
    const request = await fetch(`https://fli2mqd2g8.execute-api.us-east-1.amazonaws.com/dev/projects/${project_data.id}/assigncandidates/${candidate_id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

    const response = await request.json()

    toast.success(response.message);
    obtainSelectedCandidates();
    obtainAssignedCandidates();
  }

  useEffect(() => {
    obtainSelectedCandidates();
    obtainAssignedCandidates();
    getTests()
  }, []);

  return (
    <>
      <Header></Header>
      <div className="flex">
        <SideBar></SideBar>
        <div className="w-5/6 p-4">
          <div className={styles.center2}>
            <div className={styles.grid3}>
              <div>
                <div className={styles.card}>
                  <h1 className="animate-fade-up text-2xl from-black bg-clip-text  font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight py-2">
                    {project_data.title}
                  </h1>
                  <h1 className="animate-fade-up text-xl from-black bg-clip-text  font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight py-2">
                    Descripción
                  </h1>
                  <p>{project_data.description}</p>
                  <h1 className="animate-fade-up text-xl from-black bg-clip-text  font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight py-2">
                    Soft skills necesarias
                  </h1>
                  {project_data.soft_skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
                    >
                      {skill}
                    </span>
                  ))}
                  <h1 className="animate-fade-up text-xl from-black bg-clip-text  font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight py-2">
                    Hard skills necesarias
                  </h1>
                  {project_data.hard_skills.map((hard) => (
                    <span
                      key={hard}
                      className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                    >
                      {hard}
                    </span>
                  ))}
                  <h1 className="animate-fade-up text-xl from-black bg-clip-text  font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight py-2">
                    Roles necesarios
                  </h1>
                  <div>
                    <dl className="divide-y divide-gray-100">
                      {project_data.roles.map((role) => (
                        <div
                          key={role}
                          className="px-4 py-2 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0"
                        >
                          <dd className="text-sm font-medium leading-6 text-gray-700 sm:px-0">
                            {role}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                <div className={styles.card}>
                  <h1 className="animate-fade-up text-2xl from-black bg-clip-text  font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight py-2">
                    Miembros del proyecto
                  </h1>
                  <p>Conoce los miembros activos del proyecto</p>

                  <table className="table-auto divide-y divide-gray-300 py-2">

                    <tbody className="divide-y divide-gray-300 py-2">
                      {assignedCandidate.users.map((candidate) => (
                        <tr>
                          <td className="text-sm font-medium leading-6 text-gray-700 sm:px-3 py-1">
                            {candidate.name}
                            <p>{candidate.email}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className={styles.card}>
                  <h1 className="animate-fade-up text-2xl from-black bg-clip-text  font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight py-2">
                    Candidatos Seleccionados
                  </h1>
                  <p>A continuación podrás asignar los candidatos ideales a tu proyecto.</p>

                  <table className="table-auto divide-y divide-gray-300 py-2">
                    <thead className="">
                      <tr>
                        <th className="text-lg from-black font-bold leading-2 text-gray-900 sm:truncate sm:tracking-tight py-1">
                          Nombre
                        </th>
                        <th className="text-lg from-black font-bold leading-2 text-gray-900 sm:truncate sm:tracking-tight py-1">
                        </th>
                        <th className="text-lg from-black font-bold leading-2 text-gray-900 sm:truncate sm:tracking-tight py-1">
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300 py-2">
                      {selectedCandidate.users.map((candidate) => (
                        <tr>
                          <td className="text-sm font-medium leading-6 text-gray-700 sm:px-3 py-1">
                            {candidate.name}
                          </td>
                          <td>

                          </td>
                          <td>
                            <button onClick={() => handleAssignCandidate(candidate.id)} className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                              Asignar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={styles.card}>
                <h1 className="animate-fade-up text-2xl from-black bg-clip-text  font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight py-2">
                  Búsqueda de candidatos
                </h1>
                <p>Estas a pocos pasos de encontrar tu candidato ideal.</p>
                <TableComponent></TableComponent>
              </div>
              <div className={styles.card}>
                <h1 className="animate-fade-up text-2xl from-black bg-clip-text  font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight py-2">
                  Listado de pruebas
                </h1>
                <p className="pb-1">
                  Conoce el resultado de las pruebas realizadas a tus
                  candidatos.
                </p>

                <span className="sm:ml-3 py-2">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <CheckIcon
                      className="-ml-0.5 mr-1.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    <Link href="/test_create">Crear nueva prueba</Link>
                  </button>
                </span>

                <table className="table-auto divide-y divide-gray-300 py-3">
                  <thead className="">
                    <tr>
                      <th className="text-lg from-black font-bold leading-2 text-gray-900 sm:truncate sm:tracking-tight py-1">
                        Nombre
                      </th>
                      <th className="text-lg from-black font-bold leading-2 text-gray-900 sm:truncate sm:tracking-tight py-1">
                        Tema
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300 py-2">
                    {
                      tests.map((test) => (
                        <tr>
                          <td className="text-sm font-medium leading-6 text-gray-700 sm:px-3 py-1">
                            {test.type === "technical" ? test.title : test.type}
                          </td>
                          <td className="text-sm font-medium leading-6 text-gray-700 sm:px-3 py-1">
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              {test.hard_skills}
                            </span>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
