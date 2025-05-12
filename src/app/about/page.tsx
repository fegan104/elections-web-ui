import React from "react";

const AboutPage = () => {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-10 text-gray-800">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold text-center">About Single Transferable Vote</h1>
        <p>
          <strong>Single Transferable Vote (STV)</strong> is a voting system for elections with more than one winner. It gives voters the chance to rank candidates in order of preference, and it helps ensure the final result reflects the group as a whole.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Why use STV?</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Reduces wasted votes</li>
          <li>Reflects diverse opinions fairly</li>
          <li>Encourages honest rankings</li>
          <li>No need for tactical voting</li>
        </ul>
        <p>
          STV is used around the world in places like Ireland, Malta, Australia, and for many local and organizational elections.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">How STV works</h2>
        <p>Here’s a step-by-step overview of how votes are counted:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li><strong>Voters rank candidates</strong> in order of preference: 1st, 2nd, 3rd, etc.</li>
          <li>A <strong>quota</strong> is calculated based on the number of votes and seats.</li>
          <li>First-choice votes are counted. Anyone who reaches the quota is elected.</li>
          <li>If a candidate has extra votes, their surplus is transferred to other candidates based on next preferences.</li>
          <li>If no one reaches the quota, the candidate with the fewest votes is eliminated, and their votes are transferred.</li>
          <li>This repeats until all seats are filled.</li>
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">An example</h2>
        <p>
          Suppose you’re electing 3 people. Voters might rank the candidates like this:
        </p>
        <blockquote className="bg-gray-50 border-l-4 border-gray-300 p-3 italic">
          1. Jamie<br />
          2. Alex<br />
          3. Taylor
        </blockquote>
        <p>
          If Jamie gets more votes than needed, their extra votes go to Alex. If Taylor has the fewest votes, they’re eliminated and their votes go to the next choice on those ballots.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">How the quota works</h2>
        <p>
          We use the <strong>Droop Quota</strong>, which is:
        </p>
        <div className="bg-gray-100 rounded p-3 font-mono text-sm">
          Quota = (Total valid votes ÷ (Number of seats + 1)) + 1
        </div>
        <p>
          For example, if there are 100 votes and 3 seats, the quota would be:
        </p>
        <div className="bg-gray-50 rounded p-3 font-mono text-sm">
          (100 ÷ (3 + 1)) + 1 = 26
        </div>
        <p>
          So any candidate with 26 or more votes is elected.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">How we handle ties and transfers</h2>
        <p>
          Our app uses fractional vote transfers when redistributing surplus votes. In the case of a tie, we follow a consistent rule based on earliest rounds of elimination or a random tie-break if needed.
        </p>
        <p>
          You can read the full details in our <a target="blank" href="https://github.com/fegan104/elections-api">source code documentation</a>.
        </p>
      </section>

      <section className="pt-6 text-center">
        <p>
          Have questions or want to suggest improvements? Reach out anytime — this tool is open and always improving.
        </p>
      </section>
    </main>
  );
};

export default AboutPage;
