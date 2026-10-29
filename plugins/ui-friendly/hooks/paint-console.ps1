$ErrorActionPreference = 'Stop'
$sequence = [Console]::In.ReadToEnd()

Add-Type -Namespace UiFriendly -Name Console -MemberDefinition @'
[DllImport("kernel32.dll")] public static extern bool FreeConsole();
[DllImport("kernel32.dll")] public static extern bool AttachConsole(int pid);
[DllImport("kernel32.dll", CharSet = CharSet.Unicode)] public static extern IntPtr CreateFile(string name, uint access, uint share, IntPtr security, uint disposition, uint flags, IntPtr template);
[DllImport("kernel32.dll")] public static extern bool GetConsoleMode(IntPtr handle, out uint mode);
[DllImport("kernel32.dll")] public static extern bool SetConsoleMode(IntPtr handle, uint mode);
[DllImport("kernel32.dll", CharSet = CharSet.Unicode)] public static extern bool WriteConsole(IntPtr handle, string text, int length, out int written, IntPtr reserved);
[DllImport("kernel32.dll")] public static extern bool CloseHandle(IntPtr handle);
'@

[void][UiFriendly.Console]::FreeConsole()
if (-not [UiFriendly.Console]::AttachConsole(-1)) { exit 2 }
$out = [UiFriendly.Console]::CreateFile('CONOUT$', [uint32]3221225472, 3, [IntPtr]::Zero, 3, 0, [IntPtr]::Zero)
if ($out -eq [IntPtr]-1) { exit 3 }
$mode = 0
[void][UiFriendly.Console]::GetConsoleMode($out, [ref]$mode)
[void][UiFriendly.Console]::SetConsoleMode($out, $mode -bor 4)
$written = 0
[void][UiFriendly.Console]::WriteConsole($out, $sequence, $sequence.Length, [ref]$written, [IntPtr]::Zero)
[void][UiFriendly.Console]::SetConsoleMode($out, $mode)
[void][UiFriendly.Console]::CloseHandle($out)
