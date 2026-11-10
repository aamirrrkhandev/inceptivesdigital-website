"use client";
import { createElement, useRef, useState } from "react";
import config from "../../content/secondary-team.json";
import contract from "../../content/secondary-form-contract.json";
import type { LayoutNode } from "@/lib/site-model";

type Choice = { value: string; label: string };
type Field = { label: string; options: Choice[] };
const roles = config.roles as Record<string, Field[]>;
const inputClass =
  "bg-[#2a2a2a] sm:rounded-[1.5vh] rounded-[1vh] sm:text-[1.8vh] text-[1.5vh] border-2 border-[#4C4C4C] focus:border-[#00CE44] text-white p-[1vh] w-full";
function contractNode(node: LayoutNode, index: number): React.ReactNode {
  if (typeof node === "string") return node;
  const props: Record<string, unknown> = { ...node.props, key: index };
  if (props.id) props.id = "team-" + props.id;
  if (props.htmlFor) props.htmlFor = "team-" + props.htmlFor;
  return createElement(
    node.tag,
    props,
    node.tag === "input" ? undefined : node.children.map(contractNode),
  );
}
export default function SecondaryTeamAssessment() {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(["developer"]);
  const [answers, setAnswers] = useState<
    Record<string, Record<string, string>>
  >({});
  const [details, setDetails] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    notes: "",
  });
  const message = JSON.stringify(
    {
      heading: "Design Your Ultimate Tech Team",
      roles: selected.map((role) => ({ role, ...answers[role] })),
      company: details.company,
      notes: details.notes,
    },
    null,
    2,
  );
  function field(role: string, label: string, choices?: Choice[]) {
    return (
      <label key={label} className="block mt-[2vh] text-white">
        {label}
        {choices ? (
          <select
            required
            aria-label={role + " " + label}
            className={inputClass}
            value={answers[role]?.[label] || ""}
            onChange={(e) =>
              setAnswers((a) => ({
                ...a,
                [role]: { ...a[role], [label]: e.target.value },
              }))
            }
          >
            <option value="">Select {label}</option>
            {choices.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        ) : (
          <textarea
            required
            aria-label={role + " " + label}
            className={inputClass}
            value={answers[role]?.[label] || ""}
            onChange={(e) =>
              setAnswers((a) => ({
                ...a,
                [role]: { ...a[role], [label]: e.target.value },
              }))
            }
          />
        )}
      </label>
    );
  }
  return (
    <section
      className="bg-[#202020] lg:px-[8vh] px-0 py-[6vh]"
      data-secondary-team-form
    >
      <div className="max-w-[90%] mx-auto">
        <h2 className="text-white font-bold sm:text-[4.5vh] text-[3vh] mb-[4vh]">
          Design Your Ultimate Tech Team
        </h2>
        <form
          ref={formRef}
          data-contact-form="true"
          data-source-path="/contact-us"
        >
          <div className="flex lg:flex-row flex-col gap-[4vh]">
            <div className="lg:w-[55%] w-full flex flex-wrap gap-[2vh] content-start">
              {[...Object.keys(roles), "others"].map((role) => (
                <button
                  key={role}
                  type="button"
                  aria-pressed={selected.includes(role)}
                  onClick={() =>
                    setSelected((s) =>
                      s.includes(role)
                        ? s.filter((r) => r !== role)
                        : [...s, role],
                    )
                  }
                  className="px-[3vh] py-[2vh] rounded-[2vh] capitalize border-2 border-[#00CE44]"
                  style={{
                    background: selected.includes(role) ? "#00ce44" : "#171717",
                    color: selected.includes(role) ? "#111" : "white",
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
            <div className="lg:w-[44%] w-full">
              <div
                className="bg-[#2A2A2A] h-[50vh] mb-[2vh] border-2 sm:p-[3vh] p-[2vh] border-[#4C4C4C] rounded-[3vh]"
                style={{ overflowY: "auto" }}
              >
                <fieldset disabled={step !== 1} hidden={step !== 1}>
                  {!selected.length && <p role="alert">No Selected Roles</p>}
                  {selected.map((role) => (
                    <div
                      key={role}
                      className="border-[#00CE44] border bg-[#171717] rounded-[2.5vh] py-[2vh] px-[2.5vh] mb-[2vh]"
                    >
                      <p className="capitalize font-bold text-white">
                        {role === "others" ? role : "hire a " + role}
                      </p>
                      {role === "others" && field(role, "Required Expert")}
                      {field(role, "Duration", config.durations)}
                      {field(role, "Number of Specialists", config.numbers)}
                      {(roles[role] || []).map((item) =>
                        field(role, item.label, item.options),
                      )}
                    </div>
                  ))}
                </fieldset>
                <fieldset disabled={step !== 2} hidden={step !== 2}>
                  {(
                    [
                      ["fullName", "Full Name", "text", "name"],
                      ["company", "Company", "text", null],
                      ["email", "Work Email", "email", "email"],
                      ["phone", "Phone", "tel", "field_6a28af4"],
                      ["notes", "Notes", "text", null],
                    ] as const
                  ).map(([key, label, type, name]) => (
                    <label className="block text-white mb-[2vh]" key={key}>
                      {label}
                      <input
                        className={inputClass}
                        type={type}
                        required={key !== "notes"}
                        name={name ? `form_fields[${name}]` : undefined}
                        value={details[key]}
                        onChange={(e) =>
                          setDetails((d) => ({ ...d, [key]: e.target.value }))
                        }
                      />
                    </label>
                  ))}
                  {(contract.consent as LayoutNode[]).map(contractNode)}
                  {contractNode(contract.verification as LayoutNode, 100)}
                </fieldset>
              </div>
              {(contract.hidden as LayoutNode[]).map(contractNode)}
              <input
                type="hidden"
                name="form_fields[message]"
                value={message}
              />
              <input
                type="hidden"
                name="form_fields[field_13e5cfd]"
                value="Staff augmentation — Ultimate Tech Team"
              />
              {step === 1 ? (
                <button
                  type="button"
                  className="w-full bg-[#00CE44] text-black font-bold rounded-[2vh] px-[3vh] py-[2vh]"
                  onClick={() => {
                    if (selected.length && formRef.current?.reportValidity())
                      setStep(2);
                  }}
                >
                  Next
                </button>
              ) : (
                <div className="flex gap-[2vh]">
                  <button
                    type="button"
                    className="border-2 border-[#00CE44] rounded-[2vh] px-[3vh] py-[2vh]"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-[#00CE44] text-black font-bold rounded-[2vh] px-[3vh] py-[2vh]"
                  >
                    Submit Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
