import {
  Clock3,
  UsersRound,
  CircleHelp,
  Ticket,
  Radio,
  HeartPulse,
  Building2,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

import AboutHero from "../components/AboutHero.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import InfoCard from "../components/InfoCard.jsx";
import Mission from "../components/Mission.jsx";
import { Link } from "react-router";

const problems = [
  {
    icon: Clock3,
    title: "Uncertain Waiting Times",
    description:
      "Patients often don't know how long they will have to wait before seeing their doctor.",
  },
  {
    icon: UsersRound,
    title: "Crowded Waiting Areas",
    description:
      "Long physical queues can make hospital visits less comfortable and harder to manage.",
  },
  {
    icon: CircleHelp,
    title: "No Clear Queue Visibility",
    description:
      "Without clear queue updates, patients may struggle to know their current position or when their turn is approaching.",
  },
];

const solutions = [
  {
    icon: Ticket,
    title: "Digital Queue Tokens",
    description:
      "Receive a unique token for the selected doctor and keep your queue details easily accessible.",
  },
  {
    icon: Radio,
    title: "Queue Position Tracking",
    description:
      "Check your current queue position and follow progress as patients ahead of you are attended to.",
  },
  {
    icon: Clock3,
    title: "Estimated Waiting Time",
    description:
      "View an estimated waiting time to better understand how long it may take for your turn to arrive.",
  },
];

const steps = [
  {
    number: "01",
    title: "Register & Select Doctor",
    description:
      "Enter patient details, choose a department, select your preferred doctor, and book an OP.",
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "Receive Your Token",
    description:
      "Get a unique queue token after successfully booking your OP appointment.",
    icon: Ticket,
  },
  {
    number: "03",
    title: "Track Your Queue",
    description:
      "Check your current queue position and estimated waiting time.",
    icon: Radio,
  },
  {
    number: "04",
    title: "Follow Queue Progress",
    description:
      "Stay informed as the queue progresses and your turn approaches.",
    icon: Clock3,
  },
];

const beneficiaries = [
  {
    icon: HeartPulse,
    title: "Patients",
    description:
      "Get a digital token, check your queue position, and view estimated waiting times for a more predictable hospital visit.",
  },
  {
    icon: Building2,
    title: "Hospitals",
    description:
      "Manage doctor-wise outpatient queues more systematically and provide patients with clearer queue information.",
  },
];

export default function About() {
  return (
    <div className="bg-[#F9FAFB] dark:bg-[#111827]">
      <AboutHero />

      {/* The Problem */}
      <section className="px-4 py-16 sm:py-20 bg-[#E2F5FD]/50 dark:bg-[#123B4D]/30">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="The Problem"
            title="Waiting shouldn't be this difficult."
            description="A hospital visit can be stressful enough without the uncertainty of standing in a queue and wondering when your turn will come."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {problems.map((problem) => (
              <InfoCard key={problem.title} {...problem} />
            ))}
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="bg-[#E2F5FD]/50 px-4 py-16 dark:bg-[#123B4D]/30 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Our Solution"
            title="A clearer way to manage your wait."
            description="MediQue brings essential queue information into one place, helping patients understand their turn without relying only on physical queues."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {solutions.map((solution) => (
              <InfoCard key={solution.title} {...solution} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works*/}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="How It Works"
            title="Four simple steps to a clearer wait."
            description="From choosing your doctor to tracking your token, MediQue helps make the outpatient queue process easier to follow."
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ number, title, description, icon: Icon }) => (
              <article
                key={number}
                className="relative rounded-xl border border-[#DAE0E7] bg-white p-6 dark:border-[#374151] dark:bg-[#1F2937]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-sm font-bold tracking-wider text-[#0B81B7] dark:text-[#1598CF]">
                    STEP {number}
                  </span>

                  <div className="rounded-xl bg-[#E2F5FD] p-3 dark:bg-[#123B4D]">
                    <Icon
                      size={22}
                      strokeWidth={1.8}
                      className="text-[#0B81B7] dark:text-[#72C9EB]"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-[#1D2530] dark:text-[#F3F4F6]">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Who Benefits */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Who Benefits?"
            title="Better queue experiences for everyone."
            description="MediQue connects patient convenience with more organized outpatient queue management."
          />

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
            {beneficiaries.map((beneficiary) => (
              <InfoCard key={beneficiary.title} {...beneficiary} />
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="px-4 py-16  bg-[#E2F5FD]/50 dark:bg-[#123B4D]/30">
        <Mission />
      </section>

      {/* cta */}
      <section className="px-4 py-16 text-center sm:py-20 bg-[#E2F5FD]/50 dark:bg-[#123B4D]/30">
        <SectionHeading
          title="Ready to skip the uncertainty?"
          description="Get your queue token and stay informed about your place
          in line with MediQue."
        />
        <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/register"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B81B7] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#096B98] sm:w-auto"
          >
            Register Patient
            <ArrowRight size={17} />
          </Link>

          <Link
            to="/track-queue"
            className="inline-flex w-full items-center justify-center rounded-lg border border-[#DAE0E7] px-6 py-3 text-sm font-medium text-[#1D2530] transition-colors hover:border-[#0B81B7] hover:text-[#0B81B7] dark:border-[#374151] dark:text-[#F3F4F6] dark:hover:border-[#1598CF] dark:hover:text-[#72C9EB] sm:w-auto"
          >
            Track Queue Status
          </Link>
        </div>
      </section>
    </div>
  );
}
