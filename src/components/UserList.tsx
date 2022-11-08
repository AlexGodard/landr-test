import { Button, Classes, Dialog, Intent, Toaster } from "@blueprintjs/core";
import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FormField } from "./FormField";
import { faker } from "@faker-js/faker";
import classNames from "classnames";
import { AvatarField } from "./AvatarField";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UsersAPI } from "../mockApi";
import { times } from "lodash";
import { User } from "../mockApi";

/** Singleton toaster instance. Create separate instances for different options. */
export const AppToaster = Toaster.create();

const usersAPI = new UsersAPI(100);

export const UserList = () => {
  const queryClient = useQueryClient();
  // We're using react-query (yes, the big guns) here as if we were pulling data from a real API, but the fetcher function is changed to return data from a locally-defined function.
  const getUsers = useQuery(["users"], () => usersAPI.getUsers(), {
    enabled: true,
    refetchOnWindowFocus: false,
  });
  const createUser = useMutation({
    mutationFn: (newUser: User) => usersAPI.createUser(newUser),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      AppToaster.show({
        message: (
          <span>
            User <b>{data.name}</b> created successfully.
          </span>
        ),
        intent: "success",
        icon: "tick",
      });
      setUserFormModalType(undefined);
      setSelectedUser(undefined);
    },
  });
  const updateUser = useMutation({
    mutationFn: (user: User) => usersAPI.updateUser(user),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      AppToaster.show({
        message: (
          <span>
            User <b>{data.name}</b> updated successfully.
          </span>
        ),
        intent: "success",
        icon: "tick",
      });
      setUserFormModalType(undefined);
      setSelectedUser(undefined);
    },
  });
  const deleteUser = useMutation({
    mutationFn: (userId: string) => usersAPI.deleteUser(userId),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      AppToaster.show({
        message: (
          <span>
            User <b>{data.name}</b> successfully deleted.
          </span>
        ),
        intent: "danger",
        icon: "trash",
      });
      setUserFormModalType(undefined);
      setSelectedUser(undefined);
    },
  });
  const [userFormModalType, setUserFormModalType] = useState<
    "create" | "edit" | undefined
  >();
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  return (
    <>
      <div className="flex justify-center my-16">
        <div className="px-4 sm:px-6 lg:px-8 2xl:max-w-screen-2xl w-full">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">Contacts</h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all the contacts in your account including their name,
                avatar, email, title, address and phone number.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <Button
                large
                intent="primary"
                onClick={() => {
                  setUserFormModalType("create");
                }}
                type="button"
              >
                Add contact
              </Button>
            </div>
          </div>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Title
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Address
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Phone
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {getUsers.isLoading
                        ? times(20, (index) => {
                            return (
                              <tr key={index} className="animate-pulse">
                                <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10">
                                      <div className="h-10 w-10 rounded-full bg-slate-200" />
                                    </div>
                                    <div className="ml-4">
                                      <div className="h-4 bg-slate-200 rounded w-48 mb-1"></div>
                                      <div className="h-4 bg-slate-200 rounded w-48"></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  <div className="h-4 bg-slate-200 rounded w-48"></div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  <div className="h-4 bg-slate-200 rounded w-48 2xl:w-96"></div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 ">
                                  <div className="h-4 bg-slate-200 rounded w-24 2xl:w-36"></div>
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                  <div className="h-4 bg-slate-200 rounded w-12"></div>
                                </td>
                              </tr>
                            );
                          })
                        : getUsers.data?.map((user) => (
                            <tr key={user.email}>
                              <td className="whitespace-nowrap py-4 pl-4  text-sm sm:pl-6">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0">
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={user.picture}
                                      alt=""
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="font-medium text-gray-900">
                                      {user.name}
                                    </div>
                                    <div className="text-gray-500">
                                      {user.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-500">
                                {user.jobTitle}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-500">
                                {user.address}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-500">
                                {user.phone}
                              </td>
                              <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <Button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setUserFormModalType("edit");
                                  }}
                                >
                                  Edit
                                </Button>
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        isOpen={Boolean(userFormModalType)}
        onClose={() => {
          setSelectedUser(undefined);
          setUserFormModalType(undefined);
        }}
      >
        <Formik<Omit<User, "id">>
          initialValues={
            selectedUser || {
              name: "",
              email: "",
              jobTitle: "",
              address: "",
              phone: "",
              picture: "",
            }
          }
          validationSchema={Yup.object({
            name: Yup.string()
              .min(2, "Must be 2 characters or more")
              .required("Required"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            jobTitle: Yup.string().required("Required"),
            address: Yup.string().required("Required"),
            phone: Yup.string().required("Required"),
            picture: Yup.string().required("Required"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(false);
            if (userFormModalType === "create") {
              await createUser.mutateAsync({
                id: faker.datatype.uuid(),
                ...values,
              });
            }
            if (userFormModalType === "edit") {
              await updateUser.mutate({
                ...values,
                id: selectedUser!.id,
              });
            }
          }}
        >
          <Form>
            <div className={Classes.DIALOG_BODY}>
              <AvatarField name="picture" />
              <FormField name="name" />
              <FormField name="email" />
              <FormField name="jobTitle" />
              <FormField name="address" />
              <FormField name="phone" />
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <div
                className={classNames(
                  Classes.DIALOG_FOOTER_ACTIONS,
                  "flex justify-between"
                )}
              >
                <div>
                  {userFormModalType === "edit" && (
                    <Button
                      large
                      minimal
                      icon="trash"
                      outlined
                      intent={Intent.DANGER}
                      className="!ml-0"
                      disabled={deleteUser.isLoading}
                      loading={deleteUser.isLoading}
                      onClick={() => deleteUser.mutateAsync(selectedUser!.id)}
                    >
                      Delete user
                    </Button>
                  )}
                </div>
                <div>
                  <Button
                    large
                    onClick={() => {
                      setSelectedUser(undefined);
                      setUserFormModalType(undefined);
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    className="ml-2"
                    large
                    intent="primary"
                    type="submit"
                    disabled={updateUser.isLoading || createUser.isLoading}
                    loading={updateUser.isLoading || createUser.isLoading}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </Formik>
      </Dialog>
    </>
  );
};
