const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  const { projects, users, clientProfiles, students } = data;
  
  let errors = [];
  let warnings = [];

  console.log("--- DATABASE HEALTH CHECK ---");
  console.log(`Counts:`);
  console.log(`- Projects: ${projects?.length || 0}`);
  console.log(`- Users: ${users?.length || 0}`);
  console.log(`- Clients/Institutions: ${clientProfiles?.length || 0}`);
  console.log(`- Students: ${students?.length || 0}`);
  console.log("\n--- INTEGRITY CHECKS ---");

  // 1. Check Project Leads
  const userNames = new Set(users.map(u => u.name));
  projects.forEach(p => {
    if (!userNames.has(p.lead)) {
      warnings.push(`Project "${p.title}" has unknown lead: "${p.lead}"`);
    }
  });

  // 1b. Check Project Institutions
  const institutionNames = new Set(data.institutions ? data.institutions.map(i => i.name) : []);
  projects.forEach(p => {
    if (p.institution && !institutionNames.has(p.institution)) {
      warnings.push(`Project "${p.title}" has unknown institution: "${p.institution}"`);
    }
  });

  // 1c. Check Project Clients
  const clientNames = new Set(clientProfiles ? clientProfiles.map(c => c.name) : []);
  projects.forEach(p => {
    if (p.clientName && !clientNames.has(p.clientName)) {
      warnings.push(`Project "${p.title}" has unknown client: "${p.clientName}"`);
    }
  });

  // 1d. Check Project Activities (Server & AssignedTo)
  const serverNames = new Set(data.servers ? data.servers.map(s => s.name) : []);
  projects.forEach(p => {
    if (p.activities) {
      p.activities.forEach(a => {
        if (a.assignedTo && !userNames.has(a.assignedTo)) {
          warnings.push(`Project "${p.title}" activity "${a.name}" has unknown assignee: "${a.assignedTo}"`);
        }
        if (a.server && !serverNames.has(a.server)) {
          warnings.push(`Project "${p.title}" activity "${a.name}" has unknown server: "${a.server}"`);
        }
      });
    }
  });

  // 1e. Check Data Types
  projects.forEach(p => {
    if (typeof p.totalFunding !== 'number') {
      errors.push(`Project "${p.title}" has invalid totalFunding type: ${typeof p.totalFunding}`);
    }
    if (typeof p.progress !== 'number') {
      errors.push(`Project "${p.title}" has invalid progress type: ${typeof p.progress}`);
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (p.startDate && !dateRegex.test(p.startDate)) {
      warnings.push(`Project "${p.title}" has invalid startDate format: "${p.startDate}"`);
    }
  });

  // 2. Check Duplicate IDs
  const checkDuplicates = (arr, type) => {
    const ids = new Set();
    arr.forEach(item => {
      if (ids.has(item.id)) {
        errors.push(`Duplicate ${type} ID found: ${item.id}`);
      }
      ids.add(item.id);
    });
  };

  if(projects) checkDuplicates(projects, 'Project');
  if(users) checkDuplicates(users, 'User');
  if(students) checkDuplicates(students, 'Student');
  if(clientProfiles) checkDuplicates(clientProfiles, 'ClientProfile');

  if (errors.length === 0 && warnings.length === 0) {
    console.log("✅ HEALTHY: No critical errors found.");
  } else {
    if (errors.length > 0) {
      console.log("❌ ERRORS:");
      errors.forEach(e => console.log(`  - ${e}`));
    }
    if (warnings.length > 0) {
      console.log("⚠️ WARNINGS (Data Consistency):");
      warnings.forEach(w => console.log(`  - ${w}`));
    }
  }

} catch (err) {
  console.error("CRITICAL ERROR: Could not parse db.json", err.message);
}
