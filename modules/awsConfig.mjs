import { dob }  from '/modules/obtrusify.mjs';
export function awsConfig() {
    return JSON.parse(atob(dob("yehJ2YlN3cLNXZJlCZ6IkILFUSyE1UzMjTCNUSE9lWRRTUSRiIiw2cjVmc0VWQjNXZzN2S5VjIioUT6VWeYpXbvZ2Q5J1SRBzMjNkNiRWbDdjQvVFSYJTMxFVMvJkbyMiSsInIlJ2Zvlib6ImIwFXLvNXdoRWZzFCdy0nI=0"), 'base64').toString('ascii'));
}