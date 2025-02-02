import { type ReactElement } from "react";

export interface AnnouncementsProps {}

export function Announcements({}: AnnouncementsProps): ReactElement {
  return (
    <>
      <div className="bg-white p-4 rounded-md ">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Announcements</h1>
          <span className="text-xs text-gray-400 ">view all</span>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <div className="bg-skyLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Lorem ipsu lori.</h2>
              <span className="text-sm text-gray-400 bg-white px-1 py-1 rounded-md">
                2025-01-01
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              this is a test text, this is not real, this is a simulation, not
              share with anyone, please, private information, confidential
            </p>
          </div>

          <div className="bg-alPurpleLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Lorem ipsu lori.</h2>
              <span className="text-sm text-gray-400 bg-white px-1 py-1 rounded-md">
                2025-01-01
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              this is a test text, this is not real, this is a simulation, not
              share with anyone, please, private information, confidential
            </p>
          </div>

          <div className="bg-alYellowLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Lorem ipsu lori.</h2>
              <span className="text-sm text-gray-400 bg-white px-1 py-1 rounded-md">
                2025-01-01
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              this is a test text, this is not real, this is a simulation, not
              share with anyone, please, private information, confidential
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
