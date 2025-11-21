// Debug helper to test date parsing
// This file can be removed after debugging

import { parseAPIDateTime, getEventDateConstraints } from './ticket-helpers';

export const testDateParsing = (eventData: any) => {
  console.group('🔍 Date Parsing Debug');

  if (!eventData?.schedule) {
    console.error('❌ No event data or schedule found');
    console.groupEnd();
    return;
  }

  console.log('📅 Event Schedule:', eventData.schedule);
  console.log('📅 Start DateTime Raw:', eventData.schedule.startDateTime);
  console.log('📅 End DateTime Raw:', eventData.schedule.endDateTime);

  // Test start date parsing
  console.log('\n🔄 Testing Start Date Parsing:');
  const startResult = parseAPIDateTime(eventData.schedule.startDateTime);
  console.log('✅ Start Date Result:', startResult);

  // Test end date parsing
  console.log('\n🔄 Testing End Date Parsing:');
  const endResult = parseAPIDateTime(eventData.schedule.endDateTime);
  console.log('✅ End Date Result:', endResult);

  // Test constraints
  console.log('\n🔄 Testing Date Constraints:');
  const constraints = getEventDateConstraints(eventData);
  console.log('✅ Constraints Result:', constraints);

  // Test example dates
  if (constraints.minDate && constraints.maxDate) {
    const testDate1 = constraints.minDate;
    const testDate2 = constraints.maxDate;
    console.log('\n📊 Test Date Examples:');
    console.log('  Min Date:', testDate1);
    console.log('  Max Date:', testDate2);
  }

  console.groupEnd();
};

// Usage: Call this function from browser console
// window.testDateParsing = testDateParsing;
