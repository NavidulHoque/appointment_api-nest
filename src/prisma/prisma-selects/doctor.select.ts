export const doctorSelect = {
  id: true,
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
  reviews: {
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      patient: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      rating: true,
      comment: true,
      createdAt: true,
    },
  },
} as const;
