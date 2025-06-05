interface MismatchType {
  field: string;
  extracted: string;
  entered: string;
}

interface TextDetails {
  name: string;
  dob: string;
  aadhaar_no: string;
}

interface AIVerificationData {
  text_details: TextDetails;
}

function parseDDMMYYYY(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;

  const day = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const year = Number(parts[2]);

  if (
    isNaN(day) ||
    isNaN(month) ||
    isNaN(year) ||
    day < 1 ||
    day > 31 ||
    month < 0 ||
    month > 11 ||
    year < 1900
  ) {
    return null;
  }

  const date = new Date(year, month, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export const checkMismatches = (
  verificationData: AIVerificationData,
  formData: {
    firstName: string;
    lastName: string;
    dob: Date;
    aadharNumber: string;
  }
): MismatchType[] => {
  const mismatches: MismatchType[] = [];

  if (!verificationData?.text_details) return mismatches;

  const { name, dob, aadhaar_no } = verificationData.text_details;

  const extractedDobDate = dob ? parseDDMMYYYY(dob) : null;
  const extractedDob = extractedDobDate
    ? extractedDobDate.toISOString().split("T")[0]
    : "";

  const formDob = formData.dob?.toISOString().split("T")[0] || "";

  const extractedName = name.trim().toLowerCase();
  const fullFormName = `${formData.firstName} ${formData.lastName}`
    .trim()
    .toLowerCase();

  if (formDob && extractedDob && formDob !== extractedDob) {
    mismatches.push({
      field: "dob", // <-- changed here
      extracted: extractedDob,
      entered: formDob,
    });
  }

  if (formData.aadharNumber !== aadhaar_no) {
    mismatches.push({
      field: "aadharNumber",
      extracted: aadhaar_no,
      entered: formData.aadharNumber,
    });
  }

  if (fullFormName !== extractedName) {
    mismatches.push({
      field: "fullName",
      extracted: name,
      entered: `${formData.firstName} ${formData.lastName}`,
    });
  }

  return mismatches;
};
