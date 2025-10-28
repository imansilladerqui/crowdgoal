import { useForm } from "react-hook-form";
import {
  FaUser,
  FaWallet,
  FaCalendarAlt,
  FaBullseye,
  FaHeading,
  FaRegCommentDots,
} from "react-icons/fa";
import { useCreateProject } from "@/hooks/UseCreateProject";
import { getWalletAddress } from "@/hooks/UseWalletStorage";
import { useWalletDialogs } from "@/lib/context/WalletDialogContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker.css";
import { useState } from "react";
import { toast } from "sonner";

type FormData = {
  authorWallet: string;
  authorName: string;
  title: string;
  description: string;
  goal: string;
  expiringDate: string;
};

const CreateProject = () => {
  const walletAddress = getWalletAddress();
  const { successDialog, unexpectedErrorDialog } = useWalletDialogs();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ 
    mode: "onChange",
    defaultValues: {
      authorWallet: walletAddress || "",
      authorName: "",
      title: "",
      description: "",
      goal: "",
      expiringDate: null,
    }
  });

  const { postProject } = useCreateProject();

  const setQuickDate = (days: number) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    setSelectedDate(futureDate);
  };

  const calculateDuration = (date: Date | null) => {
    if (!date) return 0;
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);

  const onSubmit = async (data: FormData) => {
    try {
      const formDataWithTimestamp = {
        ...data,
        expiringDate: selectedDate ? Math.floor(selectedDate.getTime() / 1000).toString() : "0",
      };
      
      const result = await postProject(formDataWithTimestamp);
      if (result.success) {
        successDialog.show({
          campaignId: result.campaignId,
          txHash: result.txHash
        });
        reset();
        setSelectedDate(null);
      } else {
        toast.error(result.error || "Failed to create project");
      }
    } catch (error) {
      unexpectedErrorDialog.setMessage("An unexpected error occurred. Please try again.");
      unexpectedErrorDialog.show();
    }
  };


  return (
    <div className="py-12 px-4 w-full min-h-screen bg-black">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white flex items-center gap-3 mb-2">
            <FaBullseye className="inline-block text-purple-500" /> Create a New
            Project
          </h1>
          <p className="text-lg text-gray-200 mt-6">
            Kickstart your sports crowdfunding campaign by filling out the form below.
            Provide all the details to help sport fans understand your project and
            reach your funding goal!
          </p>
          
          {/* Campaign Requirements */}
          <div className="mt-6 p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-500/20">
            <h3 className="text-lg font-bold text-purple-300 mb-4 flex items-center gap-2">
              <FaBullseye className="text-purple-400" />
              Campaign Requirements & Guidelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-200">
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-300">Content Requirements:</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• Author name: 1-50 characters</li>
                  <li>• Project title: 1-100 characters</li>
                  <li>• Description: 1-500 characters</li>
                  <li>• Must be sports-related content</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-300">Funding Requirements:</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• Goal: 0.001 - 100,000 CHZ</li>
                  <li>• Campaign duration: 1-90 days</li>
                  <li>• Platform fee: 3% on successful campaigns</li>
                  <li>• Funds locked until campaign ends</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-200 text-sm">
                <strong>Important:</strong> Campaigns are created instantly on the blockchain. 
                Ensure all information is accurate as changes cannot be made after creation.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#221a36] rounded-2xl shadow-2xl p-10 border border-gray-800 text-white font-sans">
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label
                className="flex text-sm font-semibold mb-2 items-center gap-2"
                htmlFor="authorWallet"
              >
                <FaWallet className="text-purple-400" /> Author Wallet
              </label>
              <input
                id="authorWallet"
                type="text"
                value={walletAddress}
                disabled
                className="cursor-not-allowed w-full border-2 border-blue-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base font-semibold placeholder:font-semibold placeholder:text-base placeholder:text-gray-400 bg-gray-200 text-gray-500"
                placeholder="Wallet address"
              />
            </div>
            <div>
              <label
                className="flex text-sm font-semibold mb-2 items-center gap-2"
                htmlFor="authorName"
              >
                <FaUser className="text-purple-400" /> Author Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="authorName"
                type="text"
                {...register("authorName", {
                  required: "Please enter your name.",
                  minLength: { value: 1, message: "Name must be at least 1 character" },
                  maxLength: { value: 50, message: "Name cannot exceed 50 characters" },
                })}
                className="w-full border-2 border-blue-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base font-semibold text-black placeholder:font-semibold placeholder:text-base placeholder:text-gray-400 bg-white"
                placeholder="Your name"
              />
              {errors.authorName && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.authorName.message as string}
                </span>
              )}
            </div>
            <div>
              <label
                className="flex text-sm font-semibold mb-2 items-center gap-2"
                htmlFor="title"
              >
                <FaHeading className="text-purple-400" /> Title
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="title"
                type="text"
                {...register("title", {
                  required: "Please enter the project title.",
                  minLength: { value: 1, message: "Title must be at least 1 character" },
                  maxLength: { value: 100, message: "Title cannot exceed 100 characters" },
                })}
                className="w-full border-2 border-blue-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base font-semibold text-black placeholder:font-semibold placeholder:text-base placeholder:text-gray-400 bg-white"
                placeholder="Project title"
              />
              {errors.title && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.title.message as string}
                </span>
              )}
            </div>
            <div>
              <label
                className="flex text-sm font-semibold mb-2 items-center gap-2"
                htmlFor="description"
              >
                <FaRegCommentDots className="text-purple-400" /> Description
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="description"
                {...register("description", {
                  required: "Please describe your project.",
                  minLength: { value: 1, message: "Description must be at least 1 character" },
                  maxLength: { value: 500, message: "Description cannot exceed 500 characters" },
                })}
                className="w-full border-2 border-blue-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base font-semibold text-black placeholder:font-semibold placeholder:text-base placeholder:text-gray-400 bg-white"
                rows={3}
                placeholder="Describe your project"
              />
              {errors.description && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.description.message as string}
                </span>
              )}
            </div>
            <div>
              <label
                className="flex text-sm font-semibold mb-2 items-center gap-2"
                htmlFor="goal"
              >
                <FaBullseye className="text-purple-400" /> Goal (CHZ)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="goal"
                type="number"
                min="0"
                step="any"
                {...register("goal", {
                  required: "Please enter your funding goal in CHZ.",
                  min: { value: 0.001, message: "Goal must be at least 0.001 CHZ" },
                  max: { value: 100000, message: "Goal cannot exceed 100,000 CHZ" },
                })}
                className="w-full border-2 border-blue-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base font-semibold text-black placeholder:font-semibold placeholder:text-base placeholder:text-gray-400 bg-white"
                placeholder="Funding goal in CHZ"
              />
              {errors.goal && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.goal.message as string}
                </span>
              )}
            </div>
            <div>
              <label
                className="flex text-sm font-semibold mb-2 items-center gap-2"
                htmlFor="expiringDate"
              >
                <FaCalendarAlt className="text-purple-400" /> Expiring Date
                <span className="text-red-500 ml-1">*</span>
              </label>

              <div className="relative w-full">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => setSelectedDate(date)}
                  minDate={minDate}
                  maxDate={maxDate}
                  dateFormat="MMMM dd, yyyy"
                  placeholderText="Select campaign end date"
                  className="w-full border-2 border-blue-100 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base font-semibold text-black placeholder:font-semibold placeholder:text-base placeholder:text-gray-400 font-sans"
                  showPopperArrow={false}
                  popperClassName="react-datepicker-popper"
                  calendarClassName="react-datepicker-calendar"
                  dayClassName={(date) => {
                    const now = new Date();
                    const diffTime = date.getTime() - now.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays <= 0) return "react-datepicker-day-disabled";
                    if (diffDays <= 7) return "react-datepicker-day-short";
                    if (diffDays <= 30) return "react-datepicker-day-medium";
                    return "react-datepicker-day-long";
                  }}
                />
                <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              {/* Quick Selection Buttons - Below the input */}
              <div className="mt-3 flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setQuickDate(7)}
                  className="px-3 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  7 days
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(14)}
                  className="px-3 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  14 days
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(30)}
                  className="px-3 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  30 days
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(60)}
                  className="px-3 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  60 days
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(90)}
                  className="px-3 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  90 days
                </button>
              </div>
            </div>
            <div></div>
            <div className="flex gap-4 justify-end w-full mt-8">
              <button
                type="button"
                className="px-5 py-3 bg-blue-600 text-white rounded-lg font-bold text-lg shadow hover:bg-blue-700 transition-all"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!walletAddress || !selectedDate}
                className={`px-5 py-3 rounded-lg font-bold text-lg shadow transition-all ${
                  walletAddress && selectedDate
                    ? "bg-purple-600 text-white hover:bg-purple-700" 
                    : "bg-gray-500 text-gray-300 cursor-not-allowed"
                }`}
                title={!walletAddress ? "Please connect your wallet first" : !selectedDate ? "Please select an expiring date" : ""}
              >
                {!walletAddress ? "Connect Wallet First" : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
