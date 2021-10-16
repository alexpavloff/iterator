interface IIterator {
    hasMore(): boolean;
    getNext(): any;
    getFirst(): any;
}

interface IterableCollection {
    createInterator(type: string, reversed: boolean): IIterator;
}

class ChannelMember {
    private id: number;
    private joined: number[];
    private left: number[];
    private names: string[];

    constructor(myid: number, joined: number[], left: number[], names: string[]) {
        this.id = myid;
        this.joined = joined;
        this.left = left;
        this.names = names;
    }

    getId(): number {
        return this.id;
    }
    getJoined(): number[] {
        return this.joined;
    }
    getLeft(): number[] {
        return this.left;
    }
    getNames(): string[] {
        return this.names;
    }
}

class ChannelMembersHistory implements IterableCollection {
    private data: ChannelMember[];

    constructor(data: ChannelMember[]) {
        this.data = data;
    }

    createInterator(type: string="", reversed: boolean=false): IIterator {
        return new ChannelMembersHistoryIterator(this.data, type, reversed);
    }
}

class ChannelMembersHistoryIterator implements IIterator {
    private data: ChannelMember[];
    private index: number;
    private reversed: boolean;

    constructor(data: ChannelMember[], type: string='', reversed: boolean=false) {
        this.data = data;
        this.index = 0;
        this.reversed = reversed;

        switch(type) {
            case 'RegistrationDate': {
                this.data.sort((a, b) => (this.reversed ? 1 : -1) *
                    (b.getId() - a.getId()));
                break;
            }
            case 'Name': {
                this.data.sort((a, b) => (this.reversed ? 1 : -1) *
                    (b.getNames()[b.getNames().length - 1] > a.getNames()[a.getNames().length - 1] ? 1: -1));
                break;
            }
            case 'FirstJoinDate': {
                this.data.sort((a, b) => (this.reversed ? 1 : -1) *
                    (b.getJoined()[0] > a.getJoined()[0] || a.getJoined()[0] === undefined ? 1: -1));
                break;
            }
            case 'LastJoinDate': {
                this.data.sort((a, b) => (this.reversed ? 1 : -1) *
                    (b.getJoined()[b.getJoined().length - 1] > a.getJoined()[a.getJoined().length - 1] ||
                    a.getJoined()[a.getJoined().length - 1] === undefined ? 1: -1));
                break;
            }
            case 'FirstLeaveDate': {
                this.data.sort((a, b) => (this.reversed ? 1 : -1) *
                    (b.getLeft()[0] > a.getLeft()[0] || a.getLeft()[0] === undefined ? 1: -1));
                break;
            }
            case 'LastLeaveDate': {
                this.data.sort((a, b) => (this.reversed ? 1 : -1) *
                    (b.getLeft()[b.getLeft().length - 1] > a.getLeft()[a.getLeft().length - 1] ||
                    a.getLeft()[a.getLeft().length - 1] === undefined ? 1: -1));
                break;
            }
        }

    }

    hasMore(): boolean {
        return this.index < this.data.length
    }

    getNext(): ChannelMember {
        if (this.hasMore()) {
            this.index += 1;
        }
        return this.data[this.index];
    }

    getFirst(): ChannelMember {
        this.index = 0;
        return this.data[this.index];
    }
}

let A = new ChannelMembersHistory([
    new ChannelMember(134816566, [1629847485], [1617354427, 1630667507], ["Oleg"]),
    new ChannelMember(473107101, [1621455934], [1617629084, 1630418549], ["Vadim"]),
    new ChannelMember(333993337, [1610906178, 1628015226, 1629883767], [1628013378, 1629394092],
        ["Владислав"]),
    new ChannelMember(320625292, [1622717396, 1627556180], [1617978480, 1622791226, 1629872353],
        ["untrpalad77", "untr svtnsny", "ursa77", "unter_svetonosny"]),
    new ChannelMember(614592605, [1622107732, 1623266914, 1629578102, 1631199711],
        [1622976313, 1626926515, 1629628658], ["kedrokarp", "Vladimir Nosikov"])
]);

let it = A.createInterator("Name", true);
for(let i = it.getFirst(); it.hasMore(); i = it.getNext())
    console.log(i.names.at(-1));

/* Владислав
unter_svetonosny
Vladimir Nosikov
Vadim
Oleg */

console.log('\n')
it = A.createInterator("RegistrationDate");
for(let i = it.getFirst(); it.hasMore(); i = it.getNext())
    console.log(i.names.at(-1) + ' ' + i.id);

/* Oleg 134816566
unter_svetonosny 320625292
Владислав 333993337
Vadim 473107101
Vladimir Nosikov 614592605 */

console.log('\n')
it = A.createInterator("FirstJoinDate", true);
for(let i = it.getFirst(); it.hasMore(); i = it.getNext())
    console.log(i.names.at(-1) + ' ' + new Date(1000 * i.joined[0]));

/* Oleg Wed Aug 25 2021 01:24:45 GMT+0200 (Восточная Европа, стандартное время)
unter_svetonosny Thu Jun 03 2021 12:49:56 GMT+0200 (Восточная Европа, стандартное время)
Vladimir Nosikov Thu May 27 2021 11:28:52 GMT+0200 (Восточная Европа, стандартное время)
Vadim Wed May 19 2021 22:25:34 GMT+0200 (Восточная Европа, стандартное время)
Владислав Sun Jan 17 2021 19:56:18 GMT+0200 (Восточная Европа, стандартное время) */
console.log('\n')
it = A.createInterator("LastLeaveDate");
for(let i = it.getFirst(); it.hasMore(); i = it.getNext())
    console.log(i.names.at(-1) + ' ' + new Date(1000 * i.left.at(-1)));
/* Владислав Thu Aug 19 2021 19:28:12 GMT+0200 (Восточная Европа, стандартное время)
Vladimir Nosikov Sun Aug 22 2021 12:37:38 GMT+0200 (Восточная Европа, стандартное время)
unter_svetonosny Wed Aug 25 2021 08:19:13 GMT+0200 (Восточная Европа, стандартное время)
Vadim Tue Aug 31 2021 16:02:29 GMT+0200 (Восточная Европа, стандартное время)
Oleg Fri Sep 03 2021 13:11:47 GMT+0200 (Восточная Европа, стандартное время) */
