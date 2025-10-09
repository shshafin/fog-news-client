"use client";

import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import { usePost, usePostWithFiles } from "@/hooks/useApi";
import { IJobPost } from "@/lib/content-models"; // Assuming this is defined correctly
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/authProvider";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function CreateJobPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formJobData, setFormJobData] = useState<IJobPost>({
    _id: "",
    title: "",
    description: "",
    requirements: [],
    company: "",
    location: "",
    salary: "",
    applicationDeadline: new Date(),
    contactEmail: "",
    jobType: "full-time",
    category: "",
    experienceLevel: "entry",
    education: [],
    skills: [],
    image: "",
    isActive: true,
  });

  const { mutate: createJobs } = usePostWithFiles("/jobs/create", ["jobs"]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    field: string
  ) => {
    const { value } = e.target;
    setFormJobData({ ...formJobData, [field]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImageFile(file);
    }
  };

  const handleRequirementsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedRequirements = [...formJobData.requirements];
    updatedRequirements[index] = e.target.value;
    setFormJobData({ ...formJobData, requirements: updatedRequirements });
  };

  const handleEducationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedEducation = [...(formJobData.education ?? [])];
    updatedEducation[index] = e.target.value;
    setFormJobData({ ...formJobData, education: updatedEducation });
  };

  const handleSkillsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedSkills = [...(formJobData.skills ?? [])];
    updatedSkills[index] = e.target.value;
    setFormJobData({ ...formJobData, skills: updatedSkills });
  };

  const addRequirement = () => {
    setFormJobData({
      ...formJobData,
      requirements: [...formJobData.requirements, ""],
    });
  };

  const removeRequirement = (index: number) => {
    const updatedRequirements = formJobData.requirements.filter(
      (_, i) => i !== index
    );
    setFormJobData({ ...formJobData, requirements: updatedRequirements });
  };

  const addEducation = () => {
    setFormJobData({
      ...formJobData,
      education: [...(formJobData.education ?? []), ""],
    });
  };

  const removeEducation = (index: number) => {
    const updatedEducation = (formJobData.education ?? []).filter(
      (_, i) => i !== index
    );
    setFormJobData({ ...formJobData, education: updatedEducation });
  };

  const addSkill = () => {
    setFormJobData({
      ...formJobData,
      skills: [...(formJobData.skills ?? []), ""],
    });
  };

  const removeSkill = (index: number) => {
    const updatedSkills = (formJobData.skills ?? []).filter(
      (_, i) => i !== index
    );
    setFormJobData({ ...formJobData, skills: updatedSkills });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formJobData.title ||
      !formJobData.description ||
      !formJobData.company
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const formData = new FormData();

    // Append regular fields to formData
    formData.append("title", formJobData.title);
    formData.append("description", formJobData.description);
    formData.append("company", formJobData.company);
    formData.append("location", formJobData.location || "");
    formData.append("salary", formJobData.salary || "");
    formData.append(
      "applicationDeadline",
      formJobData.applicationDeadline.toISOString()
    );
    formData.append("contactEmail", formJobData.contactEmail || "");
    formData.append("jobType", formJobData.jobType || "full-time");
    formData.append("category", formJobData.category || "");
    formData.append("experienceLevel", formJobData.experienceLevel || "entry");
    // Append array fields
    formJobData.requirements.forEach((requirement, index) =>
      formData.append(`requirements[${index}]`, requirement)
    );
    formJobData.education?.forEach((edu, index) =>
      formData.append(`education[${index}]`, edu)
    );

    formJobData?.skills?.forEach((skill, index) =>
      formData.append(`skills[${index}]`, skill)
    );
    if (imageFile) {
      formData.append("image", imageFile);
    }
    try {
      await createJobs(formData);
      toast.success("Job created successfully!");
      router.push(`/${user?.role}/jobs`);
      // Reset the form after success
      setFormJobData({
        _id: "",
        title: "",
        description: "",
        requirements: [],
        company: "",
        location: "",
        salary: "",
        applicationDeadline: new Date(),
        contactEmail: "",
        jobType: "full-time",
        category: "",
        experienceLevel: "entry",
        education: [],
        skills: [],
        image: "",
        isActive: true,
      });
    } catch (error) {
      toast.error("Failed to create job. Please try again.");
    }
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {" "}
      <div className="space-y-6 w-full p-4">
        {/* Job Form */}
        <h2 className="text-xl font-semibold">Create a Job Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Job Title */}
          <div>
            <label className="block">Job Title</label>
            <input
              type="text"
              value={formJobData.title}
              onChange={(e) => handleInputChange(e, "title")}
              className="w-full p-2 border rounded"
              placeholder="Enter the job title"
              required
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block">Job Description</label>
            <textarea
              value={formJobData.description}
              onChange={(e) => handleInputChange(e, "description")}
              className="w-full p-2 border rounded"
              placeholder="Enter the job description"
              required
            />
          </div>

          {/* Company */}
          <div>
            <label className="block">Company</label>
            <input
              type="text"
              value={formJobData.company}
              onChange={(e) => handleInputChange(e, "company")}
              className="w-full p-2 border rounded"
              placeholder="Enter the company name"
              required
            />
          </div>

          {/* Job Location */}
          <div>
            <label className="block">Location</label>
            <input
              type="text"
              value={formJobData.location}
              onChange={(e) => handleInputChange(e, "location")}
              className="w-full p-2 border rounded"
              placeholder="Enter the job location"
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block">Salary</label>
            <input
              type="text"
              value={formJobData.salary}
              onChange={(e) => handleInputChange(e, "salary")}
              className="w-full p-2 border rounded"
              placeholder="Enter the salary"
            />
          </div>

          {/* Application Deadline */}
          <div>
            <label className="block">Application Deadline</label>
            <input
              type="date"
              value={
                formJobData.applicationDeadline.toISOString().split("T")[0]
              }
              onChange={(e) =>
                setFormJobData({
                  ...formJobData,
                  applicationDeadline: new Date(e.target.value),
                })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Contact Email */}
          <div>
            <label className="block">Contact Email</label>
            <input
              type="email"
              value={formJobData.contactEmail}
              onChange={(e) => handleInputChange(e, "contactEmail")}
              className="w-full p-2 border rounded"
              placeholder="Enter the contact email"
              required
            />
          </div>

          {/* Job Type */}
          <div>
            <label className="block">Job Type</label>
            <select
              value={formJobData.jobType}
              onChange={(e) => handleInputChange(e, "jobType")}
              className="w-full p-2 border rounded"
            >
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block">Category</label>
            <input
              type="text"
              value={formJobData.category}
              onChange={(e) => handleInputChange(e, "category")}
              className="w-full p-2 border rounded"
              placeholder="Enter the job category"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block">Job Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
            />
            {formJobData.image && (
              <div className="mt-2">
                <img
                  src={formJobData.image}
                  alt="Uploaded job image"
                  className="max-w-xs rounded"
                />
              </div>
            )}
          </div>

          {/* Experience Level */}
          <div>
            <label className="block">Experience Level</label>
            <select
              value={formJobData.experienceLevel}
              onChange={(e) => handleInputChange(e, "experienceLevel")}
              className="w-full p-2 border rounded"
            >
              <option value="entry">Entry</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>
          </div>

          {/* Requirements */}
          <div>
            <label className="block">Requirements</label>
            {formJobData.requirements.map((req, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleRequirementsChange(e, index)}
                  className="p-2 border rounded w-full"
                  placeholder={`Requirement ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRequirement}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Add Requirement
            </button>
          </div>

          {/* Education */}
          <div>
            <label className="block">Education</label>
            {(formJobData.education ?? []).map((edu, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={edu}
                  onChange={(e) => handleEducationChange(e, index)}
                  className="p-2 border rounded w-full"
                  placeholder={`Education ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addEducation}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Add Education
            </button>
          </div>

          {/* Skills */}
          <div>
            <label className="block">Skills</label>
            {(formJobData.skills ?? []).map((skill, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillsChange(e, index)}
                  className="p-2 border rounded w-full"
                  placeholder={`Skill ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSkill}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Add Skill
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Job"}
          </button>
        </form>
      </div>
    </Suspense>
  );
}
