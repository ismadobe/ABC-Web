"use client";
import Image from "next/image";
import styles from "../../page.module.css";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PaperClipIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useCallback, useEffect } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TestcardItem from "../../components/TestcardItem";
import { Container } from "postcss";
import TableComponent from "../../components/TableComponent";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation'
import { t } from "i18next";
import SideBar from "../../components/SideBar";
import fetch from "node-fetch";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function CandidateItem({ params }) {

  const router = useRouter();

  const user_id = params.id;
  let project_data = JSON.parse(localStorage.getItem("project_selected"))

  const [user, setUser] = useState({
    users: []
  });
  const [isUserInTest, setIsUserInTest] = useState(false);

  const [tests, setTests] = useState([]);
  const [interviews, setInterviews] = useState([]);

  //istambul ignore next
  const getCandidateDetail = async () => {
    const request = await fetch(`https://fli2mqd2g8.execute-api.us-east-1.amazonaws.com/dev/users/findmany`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "ids": [
            user_id
          ]
        })
      })

    const response = await request.json()

    await setUser(response)
  }

  //istambul ignore next
  const getTests = async () => {
    const request = await fetch(`https://fli2mqd2g8.execute-api.us-east-1.amazonaws.com/dev/tests/projects/${project_data.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

    const response = await request.json()

    let isUserWithinTest = response[0]?.users?.some((user) => String(user.id) === String(user_id))
    if (response.length === 0) isUserWithinTest = true

    if (isUserWithinTest) {
      await setIsUserInTest(true)
      const testsFiltered = response.filter((test) => test.type === "technical")

      const interviewsFiltered = response.filter((test) => test.type === "interview" && test.hard_skills[0] === String(user_id))

      for (const test of testsFiltered) {
        const submissionsFromUser = test.submissions?.filter((submission) => String(submission.user_id) === String(user_id))
        test.submissions = submissionsFromUser
      }

      await setTests(testsFiltered)
      await setInterviews(interviewsFiltered)
    }

  }

  //istambul ignore next
  const handleSelectCandidate = async () => {

    const request = await fetch(`https://fli2mqd2g8.execute-api.us-east-1.amazonaws.com/dev/projects/${project_data.id}/selectcandidates/${user_id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

    const response = await request.json()

    toast.success(response.message);
    router.push("/project_detail");
  }

  // istanbul ignore next
  useEffect(() => {
    getCandidateDetail()
    getTests()
  }, []);

  return (
    <>
      <div className="">
        <Disclosure as="nav" className="bg-white">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-1 sm:px-1 lg:px-1">
                <div className="relative flex h-16 items-center justify-between">
                  <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    {/* Mobile menu button*/}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="flex flex-shrink-0 items-center"></div>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <button
                      type="button"
                      className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Ver notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Mi perfil
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Configuración
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                <Link href="/company_login">Cerrar sesión</Link>
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
            </>
          )}
        </Disclosure>
      </div>
      <div className="flex">
      <SideBar></SideBar>

        <div className="w-5/6 p-4">
          <div className={styles.center2}>
            <div className="flex -space-x-2 overflow-hidden">
              <img
                className="inline-block h-20 w-20 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
          </div>

          <div className={styles.center2}>
            <div className={styles.grid3}>
              <div className={styles.card}>
                {
                  user.users.length > 0 ? (

                    <div>
                      <h1 className="animate-fade-up text-2xl from-black bg-clip-text  font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight pb-2">
                        {user.users[0].name}
                      </h1>
                      <p className="pb-2">
                        {user.users[0].name} es un candidato con experiencia en {
                          user.users[0].skills.map((skill) => (
                            <span >
                              {skill},
                            </span>
                          ))

                        } y con habilidades blandas en {
                          user.users[0].personality.map((skill) => (
                            <span >
                              {skill},
                            </span>
                          ))

                        }
                        que vive en {user.users[0].country} y tiene ganas de iniciar laboralmente en este proyecto.
                      </p>
                      <h2 className="animate-fade-up text-xl from-black bg-clip-text  font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight pt-1">
                        Habilidades Blandas
                      </h2>
                      {
                        user.users[0].personality.map((skill) => (
                          <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                            {skill}
                          </span>
                        ))
                      }

                      <h2 className="animate-fade-up text-xl from-black bg-clip-text  font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight pt-1">
                        Habilidades Duras
                      </h2>
                      {
                        user.users[0].skills.map((skill) => (
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            {skill}
                          </span>
                        ))
                      }

                      <h2 className="animate-fade-up text-xl from-black bg-clip-text  font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight pt-1">
                        País
                      </h2>

                      <p>
                        {user.users[0].country}
                      </p>

                      <h2 className="animate-fade-up text-xl from-black bg-clip-text  font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight pt-1">
                        Teléfono
                      </h2>

                      <p className="pb-2">
                        {user.users[0].phone}
                      </p>

                    </div>
                  ) : null
                }

                {
                  !isUserInTest ? (
                    <button
                      // type="submit"
                      onClick={() => handleSelectCandidate()}
                      className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Seleccionar candidato
                      {/* <Link href="/project_detail">Seleccionar candidato</Link> */}
                    </button>
                  ) : null
                }
              </div>
              <div className={styles.card}>
                <h1 className="animate-fade-up text-2xl from-black bg-clip-text  font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight py-2">
                  Pruebas de selección
                </h1>

                {
                  isUserInTest ? (
                    <p>
                      Este es un resumen de las pruebas que ha realizado el
                      candidato.
                    </p>
                  ) : (
                    <p>
                      Este candidato aún no ha sido seleccionado para realizar
                      pruebas.
                    </p>
                  )
                }

                {isUserInTest && tests.length > 0 ? (
                  <table className="table-auto divide-y divide-gray-300 py-3">
                    <thead className="">
                      <tr>
                        <th className="text-lg from-black font-bold leading-2 text-gray-900 sm:truncate sm:tracking-tight py-1">
                          Prueba
                        </th>
                        <th className="text-lg from-black font-bold leading-2 text-gray-900 sm:truncate sm:tracking-tight py-1">
                          Resultado
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
                            <td className="pl-5">
                              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                {/* {submissions.length > 0 ? submissions.filter((submission) => submission.test_id === test.id)[0]?.score : "Sin realizar"} */}
                                {test.submissions.length > 0 ? test.submissions[0].score : "Sin realizar"}
                              </span>
                            </td>
                            <td>
                              <button
                                className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              //onClick={() =>
                              //console.log(`Detalles de ${row.original.rol}`)
                              //}
                              >
                                Modificar
                              </button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                ) : null}

              </div>
              <div className={styles.card}>
                <h1 className="animate-fade-up text-2xl from-black bg-clip-text  font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight py-2">
                  Entrevistas
                </h1>
                {
                  isUserInTest ? (
                    <div>
                      <p>
                        Este es un resumen de las entrevistas del candidato.
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
                          <Link href={`/interview_create/${user_id}`}>Crear nueva entrevista</Link>
                        </button>
                      </span>
                    </div>
                  ) : (
                    <p>
                      Este candidato aún no ha sido seleccionado para realizar
                      entrevistas.
                    </p>
                  )
                }
                {
                  isUserInTest && interviews.length > 0 ? (
                    <table className="table-auto divide-y divide-gray-300 py-3">
                      <thead className="">
                        <tr>
                          <th className="text-lg from-black font-bold leading-2 text-gray-900 sm:truncate sm:tracking-tight py-1">
                            Fecha
                          </th>
                          <th className="text-lg from-black font-bold leading-2 text-gray-900 sm:truncate sm:tracking-tight py-1">
                            Resultado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-300 py-2">
                        {
                          interviews.map((interview) => (
                            <tr>
                              <td className="text-sm font-medium leading-6 text-gray-700 sm:px-3 py-1">
                                {
                                  new Date(interview.difficulty_level).toLocaleDateString('es-co',
                                    {
                                      weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric"
                                    })}
                              </td>
                              <td>
                                <button
                                  className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  onClick={() => {
                                    window.open('https://youtu.be/V8DGdPkBBxg?si=ucGakOvvh9bl892e&t=50', "_blank")
                                  }}
                                >
                                  Ver entrevista
                                </button>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  ) : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
