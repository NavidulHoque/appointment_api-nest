export const doctorSelect = {
  userId: true,
  user: {
    select: {
      fullName: true,
      email: true,
    },
  },
  specialization: true,
  education: true,
  experience: true,
  aboutMe: true,
  fees: true,
  availableTimes: true,
  isActive: true,
};
