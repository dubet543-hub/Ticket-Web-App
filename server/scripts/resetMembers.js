const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Attendee = require("../models/Attendee");

// Deletes every member (and with them their tickets, check-ins and WhatsApp status) so the next
// member starts again at CPD0001. Categories, gates and logins are kept.
// Run on the server (Render → Shell):
//   npm run reset-members          shows what would be deleted
//   npm run reset-members -- --yes deletes it
dotenv.config();

const resetMembers = async () => {
  const confirmed = process.argv.includes("--yes");
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const members = await Attendee.find({}, { registrationNo: 1, isCheckedIn: 1 }).sort({ registrationNo: 1 }).lean();
    const checkedIn = members.filter((member) => member.isCheckedIn).length;
    console.log(`Members: ${members.length} (${checkedIn} checked in)`);
    if (members.length) console.log(`Ticket numbers: ${members.map((member) => member.registrationNo).join(", ")}`);

    if (!members.length) {
      console.log("Nothing to delete. The next member will be CPD0001.");
    } else if (!confirmed) {
      console.log("\nNothing deleted. To delete all of these, run:  npm run reset-members -- --yes");
    } else {
      const { deletedCount } = await Attendee.deleteMany({});
      console.log(`\nDeleted ${deletedCount} members. The next member will be CPD0001.`);
    }
  } catch (error) {
    console.error("Reset failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

resetMembers();
