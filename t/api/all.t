#!/usr/bin/env perl

$ENV{'scot_mode'}   = "testing";
print "Resetting test db...\n";
system("mongo scot-testing <../../bin/database/reset.js 2>&1 > /dev/null");

use TAP::Harness;
my %args = (
    verbosity   => 1,
);


my $harness = TAP::Harness->new(\%args);
   $harness->runtests(
        './env.t',
        './alertgroup.t',
        './checklist.t',
#        './alert.t',
        './event.t',
        './entry.t',
        './handler.t',
        './intel.t',
        './incident.t',
        './task.t',
#        './flair.t',
        './guide.t',
#        './entity.t',
        './promote.t',
    );
