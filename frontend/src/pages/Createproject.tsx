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
  const { successDialog } = useWalletDialogs();
  
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
      expiringDate: "",
    }
  });

  const { postProject } = useCreateProject();

  const onSubmit = async (data: FormData) => {
    try {
      const result = await postProject(data);
      if (result.success) {
        successDialog.show({
          campaignId: result.campaignId,
          txHash: result.txHash
        });
        reset();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again.");
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
            Kickstart your crowdfunding campaign by filling out the form below.
            Provide all the details to help backers understand your project and
            reach your funding goal!
            <br />
            <span className="block text-sm text-purple-300 mt-4 font-semibold">
              Disclaimer: After submission, your project will be put into review
              and must be approved before it goes live.
            </span>
          </p>
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
              <input
                id="expiringDate"
                type="date"
                {...register("expiringDate", {
                  required: "Please select the expiring date.",
                })}
                className="w-full border-2 border-blue-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base font-semibold text-black placeholder:font-semibold placeholder:text-base placeholder:text-gray-400 font-sans"
                placeholder="Expiring date"
              />
              {errors.expiringDate && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.expiringDate.message as string}
                </span>
              )}
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
                disabled={!walletAddress}
                className={`px-5 py-3 rounded-lg font-bold text-lg shadow transition-all ${
                  walletAddress 
                    ? "bg-purple-600 text-white hover:bg-purple-700" 
                    : "bg-gray-500 text-gray-300 cursor-not-allowed"
                }`}
                title={!walletAddress ? "Please connect your wallet first" : ""}
              >
                {walletAddress ? "Create Project" : "Connect Wallet First"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
