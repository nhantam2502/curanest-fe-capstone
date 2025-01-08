import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  
  interface NurseProfile {
    id: number;
    name: string;
    email: string;
    qualifications: string;
    status: "Pending" | "Approved" | "Rejected";
  }
  
  interface NurseProfilesTableProps {
    nurseProfiles: NurseProfile[];
    onApprove: (profileId: number) => void;
    onReject: (profileId: number) => void;
  }
  
  export default function NurseProfilesTable({
    nurseProfiles,
    onApprove,
    onReject,
  }: NurseProfilesTableProps) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Qualifications</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nurseProfiles.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>{profile.name}</TableCell>
              <TableCell>{profile.email}</TableCell>
              <TableCell>{profile.qualifications}</TableCell>
              <TableCell>{profile.status}</TableCell>
              <TableCell className="text-right space-x-2">
                {profile.status === "Pending" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onApprove(profile.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onReject(profile.id)}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }