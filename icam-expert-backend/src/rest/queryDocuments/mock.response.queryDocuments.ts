// 1. Interview
// const mockAnswer = `<b>Analysis of Discrepancies</b></n>
// <b>1. Timing discrepancy</b></n>
// * Incident reported to supervisor at 16:46 by Nathan Cross</n>
// * Tim Brown notified Stanmore supervisors at approximately 16:58</n>
// <b>2. Roles and involvement discrepancy</b></n>
// * Nathan Cross mentioned being the first responder who also took Daniel to the medics</n>
// * Richard Heritage mentioned receiving a call from Tim Brown and meeting Nathan and the crew at the paramedic</n>
// <b>3. Communication discrepancy</b></n>
// * Nathan Cross engaged 'E stops' and communicated with the second offsider for preparing the ute</n>
// * Richard Heritage did not mention the engagement of 'E stops' or communications with the second offsider</n>
// <b>4. Incident description discrepancy</b></n>
// * Nathan Cross described the offsider adjusting the insert and getting his finger caught</n>
// * Richard Heritage did not describe the exact moment of injury but stated the incident as a degloved fingertip</n>
// <b>Suggested Additional Interview Questions</b></n>
// <b>Nathan Cross (Driller):</b></n>
// 1. Can you clarify the exact time of the incident and the sequence in which you notified Tim Brown?</n>
// 2. Did you encounter any difficulties when engaging the 'E stops' and preparing the ute?</n>
// 3. Can you explain the communication with the second offsider during and after the incident?</n>
// <b>Richard Heritage (Exploration Supervisor):</b></n>
// 1. What were the exact details Tim Brown communicated to you regarding the incident and Nathan Cross’s actions?</n>
// 2. Can you describe what you observed when you reached the paramedic station?</n>
// 3. Was there any communication with Nathan Cross or the second offsider after you arrived at the paramedics?</n>
// 4. Can you give more details about how the ambulance service was involved and the timelines?</n>
// ###
// [
//   {
//     "Name": "Nathan Cross",
//     "Questions": [
//       "How long were you waiting before you went to the medics?",
//       "What was the exact communication between you and the offsider Daniel before the incident?",
//       "Can you describe what you were looking at when you briefly looked away?"
//     ]
//   },
//   {
//     "Name": "Richard Heritage",
//     "Questions": [
//       "Can you clarify the exact time sequence from when you were notified by Tim Brown until you met with the drill crew?",
//       "What specific steps did you take after receiving the call about the incident?",
//       "Were there any changes to the work procedure after the incident that you noticed?"
//     ]
//   }
// ]`;

// PEEPO
// const mockAnswer =
//   '```json\n[\n    {\n        "Category": "People",\n        "Details": "Richard (Exploration Supervisor), Daniel Fischer (Injured Person), Tim Brown (Caller to Richard), Nathan Cross (Transported Injured Person), Brendon Balmain (Notified Supervisor)",\n        "Other": "Richard was in the office during the incident, Tim Brown informed Richard about the injury, Nathan Cross took Daniel to the paramedic",\n        "RelevantData": "Detailed statements from Daniel Fischer, Tim Brown, Nathan Cross, and Brendon Balmain"\n    },\n    {\n        "Category": "Environment",\n        "Details": "No specific environmental factors mentioned",\n        "Other": "Incident occurred late afternoon",\n        "RelevantData": "Specific time-related influences, workspace conditions around drilling site"\n    },\n    {\n        "Category": "Equipment",\n        "Details": "No specific equipment issues reported",\n        "Other": "Potential equipment malfunction not mentioned",\n        "RelevantData": "Details about equipment used by Daniel Fischer at the time of injury"\n    },\n    {\n        "Category": "Procedures",\n        "Details": "Notification procedure followed by Richard, transport of injured person to paramedic",\n        "Other": "Procedure to notify supervisors followed",\n        "RelevantData": "Specific procedures followed by Daniel Fischer and drill crew at time of incident"\n    },\n    {\n        "Category": "Organization",\n        "Details": "Richard reported incident to Brendan Balmain, waiting for ambulance",\n        "Other": "State of on-site first response protocols",\n        "RelevantData": "Communication effectiveness between exploration teams, efficiency of emergency response plan"\n    }\n]\n```';

// ROOT CAUSE ANALYSIS
// const mockAnswer = `<b>1. Inadequate Communication</b></n>• <b>Summary:</b> Miscommunication between the driller and the offsider about the exact timing and actions while lowering the rods.</n>• <b>Explanation:</b></n>###[
//   {
//     "Contributing Factor": "Briefly looked away from offsider",
//     "Certainty Rating": "95%",
//     "Explanation": "Richard Heritage mentioned the driller briefly looked down the side of the rig to check on the second offsider, indicating distracted attention during the critical task."
//   },
//   {
//     "Contributing Factor": "No clear instructions to offsider",
//     "Certainty Rating": "90%",
//     "Explanation": "The event debrief indicated that the driller did not stop the movement of rods while the offsider was adjusting the insert, which required immediate and clear communication."
//   },
//   {
//     "Contributing Factor": "No pre-task communication",
//     "Certainty Rating": "85%",
//     "Explanation": "There is no indication that there was a thorough communication session before the task commenced regarding the specific steps and responsibilities."
//   }
// ]###

// <b>2. Lack of Situational Awareness</b></n>• <b>Summary:</b> The driller and offsider did not maintain consistent attention to their surroundings and the task at hand, resulting in the offsider's finger getting caught.</n>• <b>Explanation:</b></n>###[
//   {
//     "Contributing Factor": "Driller continued moving rods while distracted",
//     "Certainty Rating": "95%",
//     "Explanation": "The driller admitted to continuing rod movement while briefly checking on the second offsider, showing a lapse in situational awareness."
//   },
//   {
//     "Contributing Factor": "Hand placement by offsider",
//     "Certainty Rating": "90%",
//     "Explanation": "The offsider placed his hand in an unsafe location to adjust the insert, indicating a lack of awareness about the dangers of hand placement."
//   },
//   {
//     "Contributing Factor": "Absence of stop or warning signal",
//     "Certainty Rating": "85%",
//     "Explanation": "No stop or warning signals were used to indicate when it was unsafe to adjust inserts, highlighting a gap in hazard recognition."
//   }
// ]###`;

// TODO: function to get mock answer for each tool
// ORGANISATIONAL LEARNINGS
export const mockAnswer = `json
 [{"Contributing Factor":"Brief Distraction While Lowering Rods","Action":"Action 1","Description":"Conduct training on the importance of remaining fully focused during critical operational tasks to avoid any distractions that could lead to injury."},{"Contributing Factor":"Brief Distraction While Lowering Rods","Action":"Action 2","Description":"Implement a buddy check system where one person monitors operations while another performs the task, ensuring no room for distraction."},{"Contributing Factor":"Hand Placement During Insert Adjustment","Action":"Action 1","Description":"Introduce detailed procedural training emphasizing the importance of hand placement and the risks involved with the equipment's moving parts."},{"Contributing Factor":"Hand Placement During Insert Adjustment","Action":"Action 2","Description":"Develop standardized signs or markings on equipment highlighting safe zones for hand placement to minimize the risk of injury."},{"Contributing Factor":"Communication Errors","Action":"Action 1","Description":"Enhance communication protocols ensuring clear and direct communication between team members during operations to prevent misunderstandings."},{"Contributing Factor":"Communication Errors","Action":"Action 2","Description":"Implement communication devices such as headsets for clearer and immediate exchange of critical information during operations."},{"Contributing Factor":"Procedure for Emergency Response","Action":"Action 1","Description":"Conduct regular emergency response drills to ensure all team members are familiar with the procedures, improving response times and efficiency during real incidents."},{"Contributing Factor":"Procedure for Emergency Response","Action":"Action 2","Description":"Review and update emergency response protocols to cover all possible scenarios, and ensure they are easily accessible to all workers on site."}]
`;
