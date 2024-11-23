import { BiSolidSend } from "react-icons/bi";
import InputText from "@/components/form/InputText";
import CustomSelect from "@/components/form/CustomSelect";
import { AI_SOURCES, FITNESS_LEVELS, GENDERS, GOALS } from "@/constants";
import toast from "react-hot-toast";
import React from "react";

const GENERATE_URL = "/api/generate";

export default function UserForm({ setData, setLoading, loading }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = {
      model: event.target.elements.model.value,
      height: event.target.elements.height.value,
      weight: event.target.elements.weight.value,
      age: event.target.elements.age.value,
      gender: event.target.elements.gender.value,
      fitnessLevel: event.target.elements.fitnessLevel.value,
      goal: event.target.elements.goal.value,
    };

    try {
      let response = await fetch(GENERATE_URL, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setData(data.result);
        setLoading(false);
        toast.success("Workout generated!");
      } else {
        setLoading(false);
        toast.error(data.error?.message || 'An error occurred');
      }
    } catch (error) {
      setLoading(false);
      toast.error('Failed to generate workout');
    }
  };

  return (
    <form
      className="w-full my-10 mt-6 p-4 border border-gray-100 rounded-xl shadow-md"
      onSubmit={handleSubmit}
      autoComplete={"off"}
      data-testid="user-form"
    >
      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <CustomSelect id={"model"} label={"AI Source"} values={AI_SOURCES} />
        </div>
      </div>
      <hr className={"my-5"} />
      <div className="flex flex-wrap -mx-3 mb-3">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <InputText label={"Height (cm)"} id={"height"} />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <InputText label={"Weight (kg)"} id={"weight"} />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <InputText label={"Age (yr)"} id={"age"} />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <CustomSelect id={"gender"} label={"Gender"} values={GENDERS} />
        </div>

        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <CustomSelect
            id={"fitnessLevel"}
            label={"Fitness Level"}
            values={FITNESS_LEVELS}
          />
        </div>

        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <CustomSelect id={"goal"} label={"Goal"} values={GOALS} />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary-main px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark disabled:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {loading ? (
            "Please wait..."
          ) : (
            <div className={"flex justify-center items-center gap-2"}>
              Submit <BiSolidSend />
            </div>
          )}
        </button>
      </div>
    </form>
  );
}
