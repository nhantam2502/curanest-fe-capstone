import http from "@/lib/http";
import { AppointmentFilter } from "@/types/appointment";
import { Res } from "@/types/service";

const appointmentApiRequest = {
  getAppointment: (filter: AppointmentFilter | null) => {
    let queryString = `/appointment/api/v1/appointments`;

    if (filter) {
      const params = new URLSearchParams();
      Object.entries(filter).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      queryString += `?${params.toString()}`;
    }

    return http.get<Res>(queryString);
  },
};
export default appointmentApiRequest;
